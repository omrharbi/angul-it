import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CaptchaState } from './captcha-state';

describe('CaptchaState', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [CaptchaState, provideRouter([])],
    });
  });

  afterEach(() => localStorage.clear());

  it('tracks progress and keeps the score when revisiting a passed stage', () => {
    const state = TestBed.inject(CaptchaState);

    state.passStage();
    state.prevStage();
    state.passStage();

    expect(state.currentStage()).toBe(1);
    expect(state.score()).toBe(1);
  });

  it('restores an active session from localStorage', () => {
    const firstState = TestBed.inject(CaptchaState);
    firstState.passStage();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CaptchaState, provideRouter([])],
    });

    const restoredState = TestBed.inject(CaptchaState);
    expect(restoredState.currentStage()).toBe(1);
    expect(restoredState.score()).toBe(1);
  });

  it('marks the session complete after all stages pass', () => {
    const state = TestBed.inject(CaptchaState);

    state.passStage();
    state.passStage();
    state.passStage();

    expect(state.completed()).toBe(true);
    expect(state.score()).toBe(3);
    expect(JSON.parse(localStorage.getItem('angul_it_state') ?? '{}').completed).toBe(true);
  });
});