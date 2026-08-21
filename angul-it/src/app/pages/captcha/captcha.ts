
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageCaptcha } from '../../challenge/image-captcha/image-captcha';
import { TextCaptcha } from '../../challenge/text-captcha/text-captcha';
import { CaptchaState } from '../../core/services/captcha-state';
import { MathCaptcha } from '../../challenge/math-captcha/math-captcha';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TextCaptcha,
    MathCaptcha,
    ImageCaptcha,
  ],
  templateUrl: './captcha.html',
  styleUrls: ['./captcha.scss'],
})
export class Captcha implements OnInit {
  constructor(public state: CaptchaState) { }
  ngOnInit(): void {  }
  onStagePassed(): void {
    this.state.passStage();
  }

  onBack(): void {
    this.state.prevStage();
  }
}