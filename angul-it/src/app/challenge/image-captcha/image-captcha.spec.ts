import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCaptcha } from './image-captcha';

describe('ImageCaptcha', () => {
  let component: ImageCaptcha;
  let fixture: ComponentFixture<ImageCaptcha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCaptcha],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageCaptcha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
