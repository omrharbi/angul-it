import { Component, Output, EventEmitter, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoiseDot, NoiseLine, SvgChar } from '../../core/services/interface';


@Component({
  selector:    'app-text-captcha',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './text-captcha.html',
  styleUrls:   ['./text-captcha.scss'],
})
export class TextCaptcha implements OnInit {
  @Output() passed = new EventEmitter<void>();

  ngOnInit(): void {
    this.generate();
  }

   readonly CHARS   = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
   readonly LENGTH  = 5;
   readonly SVG_W   = 320;
   readonly SVG_H   = 110;
   readonly COLORS  = [
    '#00E5FF', '#80F0FF', '#FFFFFF',
    '#00BCD4', '#4DD0E1', '#B2EBF2',
  ];

  userInput  = signal('');
  showError  = signal(false);
  showSuccess = signal(false);
  attempts   = signal(0);

  private secret = '';

  svgChars = signal<SvgChar[]>([]);
  noiseLines = signal<NoiseLine[]>([]);
  noiseDots  = signal<NoiseDot[]>([]);

  inputUppercase = computed(() => this.userInput().toUpperCase().trim());

  canSubmit = computed(() => this.userInput().trim().length === this.LENGTH);

  // ── CONSTRUCTOR: generate on load ───────────────────────────
  constructor() {
    this.generate();
  }

  // ── GENERATE: builds secret + all SVG data ──────────────────
  generate(): void {
    this.secret    = this.makeSecret();
    this.userInput.set('');
    this.showError.set(false);
    this.showSuccess.set(false);
    this.svgChars.set(this.buildChars());
    this.noiseLines.set(this.buildLines());
    this.noiseDots.set(this.buildDots());
  }

  // ── VERIFY: check user input vs secret ──────────────────────
  verify(): void {
    if (!this.canSubmit()) return;

    if (this.inputUppercase() === this.secret) {
      this.showError.set(false);
      this.showSuccess.set(true);
      // small delay so user sees success state before moving on
      setTimeout(() => this.passed.emit(), 800);
    } else {
      this.attempts.update(v => v + 1);
      this.showError.set(true);
      this.showSuccess.set(false);
      // regenerate after wrong answer
      setTimeout(() => this.generate(), 600);
    }
  }

  onInputChange(value: string): void {
    this.userInput.set(value);
    this.showError.set(false);
  }

  // ── PRIVATE: make a random secret string ────────────────────
  private makeSecret(): string {
    return Array.from({ length: this.LENGTH }, () =>
      this.CHARS[Math.floor(Math.random() * this.CHARS.length)]
    ).join('');
  }

  // ── PRIVATE: build SVG character objects ────────────────────
  private buildChars(): SvgChar[] {
    const spacing = this.SVG_W / (this.LENGTH + 1);
    return this.secret.split('').map((char, i) => ({
      char,
      x:        spacing * (i + 1) + this.rand(-6, 6),
      y:        this.SVG_H / 2 + this.rand(-8, 8),
      rotation: this.rand(-22, 22),
      fontSize: this.rand(28, 40),
      color:    this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
    }));
  }

  // ── PRIVATE: build noise lines ──────────────────────────────
  private buildLines(): NoiseLine[] {
    return Array.from({ length: 5 }, () => ({
      x1: this.rand(0, this.SVG_W),
      y1: this.rand(0, this.SVG_H),
      x2: this.rand(0, this.SVG_W),
      y2: this.rand(0, this.SVG_H),
      color: Math.random() > 0.5 ? '#1E2A3A' : '#0A3040',
    }));
  }

  // ── PRIVATE: build noise dots ───────────────────────────────
  private buildDots(): NoiseDot[] {
    return Array.from({ length: 14 }, () => ({
      cx:    this.rand(0, this.SVG_W),
      cy:    this.rand(0, this.SVG_H),
      r:     this.rand(1, 3),
      color: Math.random() > 0.5 ? '#1C3344' : '#0D2233',
    }));
  }

  // ── PRIVATE: random number between min and max ───────────────
  private rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}