// progress-bar.component.ts
// ─────────────────────────────────────────────────────────────
// SHARED component — used by CaptchaComponent
// Receives [current] and [total] from parent via @Input()
// ─────────────────────────────────────────────────────────────

import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector:    'app-progress-bar',
  standalone:  true,
  imports:     [],
  template: `
    <div class="progress">
      <div
        class="progress__fill"
        [style.width.%]="widthPercent()"
      ></div>
    </div>
  `,
  styles: [`
    .progress {
      width:      100%;
      height:     3px;
      background: rgba(255,255,255,0.06);
      position:   relative;
      z-index:    20;
    }

    .progress__fill {
      height:     100%;
      background: #00E5FF;
      box-shadow: 0 0 8px rgba(0,229,255,0.5);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class ProgressBar {

  // @Input() → parent SENDS this value to this component
  // [current]="state.currentStage()" in parent template
  @Input() current: number = 0;

  // @Input() → parent sends total number of stages
  // [total]="state.total" in parent template
  @Input() total:   number = 3;

  // computed → calculates width % from inputs
  // NOTE: @Input values aren't signals, so we use a getter instead
  get widthPercent(): () => number {
    return () => Math.round((this.current / this.total) * 100);
  }
}