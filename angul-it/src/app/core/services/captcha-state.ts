import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

// ── TYPES — defined first so everything below can use them ──
export type ChallengeType = 'text' | 'math' | 'image';

export interface StageResult {
  type:   ChallengeType;
  passed: boolean;
}

// renamed to SessionState to avoid conflict with the class name CaptchaState
interface SessionState {
  currentStage: number;
  totalStages:  number;
  score:        number;
  completed:    boolean;
  stages:       StageResult[];
  sessionActive: boolean;  // flag to track if session is currently active
  timestamp:    number;    // timestamp when session was last saved
}

const STORAGE_KEY  = 'angul_it_state';
const TOTAL_STAGES = 3;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;  // 30 minutes - if older, treat as stale

@Injectable({ providedIn: 'root' })
export class CaptchaState {

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  // ── SIGNALS ────────────────────────────────────────────────
  currentStage = signal<number>(0);
  score        = signal<number>(0);
  completed    = signal<boolean>(false);

  // signal holding array of StageResult
  stages = signal<StageResult[]>([
    { type: 'text',  passed: false },
    { type: 'math',  passed: false },
    { type: 'image', passed: false },
  ]);

  // ── COMPUTED ────────────────────────────────────────────────
  currentChallenge = computed<ChallengeType>(() =>
    this.stages()[this.currentStage()]?.type ?? 'text'
  );

  progressPercent = computed(() =>
    Math.round((this.currentStage() / TOTAL_STAGES) * 100)
  );

  stageLabel = computed(() =>
    `Stage ${this.currentStage() + 1} of ${TOTAL_STAGES}`
  );

  hasPrev = computed(() => this.currentStage() > 0);

  total = TOTAL_STAGES;

  // ── METHODS ─────────────────────────────────────────────────
  passStage(): void {
    const index = this.currentStage();

    this.stages.update(prev => {
      const next = [...prev];
      next[index] = { ...next[index], passed: true };
      return next;
    });

    this.score.update(v => v + 1);

    if (index + 1 >= TOTAL_STAGES) {
      this.completed.set(true);
      this.saveToStorage();  // Mark session as inactive after completion
      this.router?.navigate(['/result']);
    } else {
      this.currentStage.update(v => v + 1);
      this.saveToStorage();
    }
  }

  prevStage(): void {
    if (this.hasPrev()) {
      this.currentStage.update(v => v - 1);
      this.saveToStorage();
    }
  }

  reset(navigateTo: string = '/captcha'): void {
    this.clearState();
    this.router?.navigate([navigateTo]);
  }

  // ── CLEAR STATE: Full reset without navigation ───────────────
  clearState(): void {
    this.currentStage.set(0);
    this.score.set(0);
    this.completed.set(false);
    this.stages.set(this.shuffleStages());
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // ── START SESSION: Mark session as active (called when user verifies) ──
  startSession(): void {
    this.clearState();
    // Don't save to localStorage yet, will save on first pass
  }

  private shuffleStages(): StageResult[] {
    const types: ChallengeType[] = ['text', 'math', 'image'];
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    return types.map(type => ({ type, passed: false }));
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const state: SessionState = {
      currentStage: this.currentStage(),
      totalStages:  TOTAL_STAGES,
      score:        this.score(),
      completed:    this.completed(),
      stages:       this.stages(),
      sessionActive: true,
      timestamp:    Date.now(),  // save current timestamp
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const state: SessionState = JSON.parse(raw);
      
      // Check if session is stale (older than timeout) or not marked as active
      const now = Date.now();
      const sessionAge = now - (state.timestamp || 0);
      
      if (!state.sessionActive || sessionAge > SESSION_TIMEOUT_MS) {
        // Session is stale or invalid, clear it
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      
      this.currentStage.set(state.currentStage);
      this.score.set(state.score);
      this.completed.set(state.completed);
      this.stages.set(state.stages);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}