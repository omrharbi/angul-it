import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeType, SessionState, StageResult } from './interface';


const STORAGE_KEY  = 'angul_it_state';
const TOTAL_STAGES = 3;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class CaptchaState {

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  currentStage = signal<number>(0);
  score        = signal<number>(0);
  completed    = signal<boolean>(false);

  stages = signal<StageResult[]>([
    { type: 'text',  passed: false },
    { type: 'math',  passed: false },
    { type: 'image', passed: false },
  ]);

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
      this.saveToStorage(); 
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

  clearState(): void {
    this.currentStage.set(0);
    this.score.set(0);
    this.completed.set(false);
    this.stages.set(this.shuffleStages());
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  startSession(): void {
    this.clearState();
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
      timestamp:    Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const state: SessionState = JSON.parse(raw);
      
      const now = Date.now();
      const sessionAge = now - (state.timestamp || 0);
      
      if (!state.sessionActive || sessionAge > SESSION_TIMEOUT_MS) {
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