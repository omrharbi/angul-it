import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathCaptcha } from './math-captcha';

describe('MathCaptcha', () => {
  let component: MathCaptcha;
  let fixture: ComponentFixture<MathCaptcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathCaptcha],
    }).compileComponents();

    fixture = TestBed.createComponent(MathCaptcha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
