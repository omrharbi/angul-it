// ─────────────────────────────────────────────────────────────
//  captcha.component.ts
//  The STAGE MANAGER — does not show challenges itself.
//  Controls which challenge is shown + handles navigation.
// ─────────────────────────────────────────────────────────────

import { Component, OnInit } from '@angular/core';
//                  ↑ OnInit = lifecycle hook interface

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// import the state service
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { ImageCaptcha } from '../../challenge/image-captcha/image-captcha';
import { TextCaptcha } from '../../challenge/text-captcha/text-captcha';
import { CaptchaState } from '../../core/services/captcha-state';
import { MathCaptcha } from '../../challenge/math-captcha/math-captcha';
@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextCaptcha,
    MathCaptcha,
    ImageCaptcha,
    ProgressBar,
  ],
  templateUrl: './captcha.html',
  styleUrls: ['./captcha.scss'],
})
export class Captcha implements OnInit {
  constructor(public state: CaptchaState) { }
  ngOnInit(): void {
    // // If user already completed all stages → send them to result
    // if (this.state.completed()) {
    //   // you can optionally redirect here if needed
    //   // this.router.navigate(['/result']);
    // }
  }
  onStagePassed(): void {
    this.state.passStage();
  }

  // ── CALLED BY BACK BUTTON ──────────────────────────────────
  onBack(): void {
    this.state.prevStage();
  }
}