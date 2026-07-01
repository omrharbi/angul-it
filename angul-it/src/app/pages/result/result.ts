import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterLink }        from '@angular/router';
import { CaptchaState }      from '../../core/services/captcha-state';

@Component({
  selector:    'app-result',
  standalone:  true,
  imports:     [CommonModule, RouterLink],
  templateUrl: './result.html',
  styleUrls:   ['./result.scss'],
})
export class Result implements OnInit {

  constructor(public state: CaptchaState, private router: Router) {}

  typeLabel: Record<string, string> = {
    text:  'Text Recognition',
    math:  'Math Challenge',
    image: 'Image Selection',
  };
 
  get scorePercent(): number {
    return Math.round((this.state.score() / this.state.total) * 100);
  }

  get passed(): boolean {
    return this.state.score() >= 2; // pass if ≥ 2 out of 3
  }

  ngOnInit(): void {
    // guard already handles redirect if not completed
  }
  goHome(): void {
    this.state.reset('/');
  }

  restart(): void {
    
    this.state.reset(); // resets signals + localStorage + navigates to /captcha
  }
}