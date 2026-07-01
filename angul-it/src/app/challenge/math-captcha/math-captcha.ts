import { Component, Output, EventEmitter, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Operator = '+' | '-' | '×';

interface Equation {
  a:        number;
  b:        number;
  operator: Operator;
  answer:   number;
}

@Component({
  selector:    'app-math-captcha',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './math-captcha.html',
  styleUrls:   ['./math-captcha.scss'],
})
export class MathCaptcha implements OnInit {

  @Output() passed = new EventEmitter<void>();
  userInput   = signal('');
  showError   = signal(false);
  showSuccess = signal(false);
  attempts    = signal(0);
  equation    = signal<Equation>(this.generate());

  ngOnInit(): void {
    this.refresh();
  }

  // ── COMPUTED ────────────────────────────────────────────────
  canSubmit = computed(() => this.userInput().length > 0);
  
  // ── GENERATE: random equation ────────────────────────────────
  generate(): Equation {
    const operators: Operator[] = ['+', '-', '×'];
    const op = operators[Math.floor(Math.random() * operators.length)];

    let a: number, b: number, answer: number;
    
    
    if (op === '+') {
      a = this.rand(1, 50);
      b = this.rand(1, 50);
      answer = a + b;
    } else if (op === '-') {
      a = this.rand(10, 50);
      b = this.rand(1, a);       // b ≤ a so answer is always positive
      answer = a - b;
    } else {
      a = this.rand(2, 12);
      b = this.rand(2, 12);
      answer = a * b;
    }

    return { a, b, operator: op, answer };
  }

  refresh(): void {
    console.log(this.userInput,"this.generate()");
    
    this.equation.set(this.generate());
    this.userInput.set('');
    this.showError.set(false);
    this.showSuccess.set(false);
  }

  onInputChange(value: string): void {
    // only allow digits and optional minus sign
    // console.log(value,value.replace(/[^0-9-]/g, ''));
      console.log(this.userInput() ,"length");
      
    this.userInput.set(value);
    this.showError.set(false);
  }

  verify(): void {
    if (!this.canSubmit()) return;

    const userAnswer = parseInt(this.userInput(), 10);
    const correct    = this.equation().answer;

    if (userAnswer === correct) {
      this.showSuccess.set(true);
      this.showError.set(false);
      setTimeout(() => this.passed.emit(), 800);
    } else {
      this.attempts.update(v => v + 1);
      this.showError.set(true);
      this.showSuccess.set(false);
      setTimeout(() => this.refresh(), 600);
    }
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}