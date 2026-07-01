export type ChallengeType = 'text' | 'math' | 'image';

export interface CaptchaStateInterface {
  sessionId:    string;
  currentStage: number;
  totalStages:  number;
  score:        number;
  completed:    boolean;
  stages:       StageResult[];
}

export interface StageResult {
  type: ChallengeType;
  passed: boolean;
}

export interface CaptchaStateData {
  sessionId:    string;
  currentStage: number;
  totalStages:  number;
  score:        number;
  completed:    boolean;
  stages:       StageResult[];
}

export interface GridCell {
  symbol:    string;  // the symbol shown
  isTarget:  boolean; // is this a correct cell?
  selected:  boolean; // has the user selected it?
}

export interface Challenge {
  target:      string; // the symbol user must find
  targetLabel: string; // human readable label
  cells:       GridCell[];
}


// ── SVG character shape ─────────────────────────────────────
export interface SvgChar {
  char:     string;
  x:        number;
  y:        number;
  rotation: number;
  fontSize: number;
  color:    string;
}

// ── SVG noise line ──────────────────────────────────────────
export interface NoiseLine {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

// ── SVG noise dot ───────────────────────────────────────────
export interface NoiseDot {
  cx: number; cy: number; r: number; color: string;
}