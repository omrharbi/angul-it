import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Captcha } from './pages/captcha/captcha';
import { Result } from './pages/result/result';
import { ErrorMessage } from './shared/components/error-message/error-message';
import { Home } from './pages/home/home';
import { captchaGuard } from './core/guards/captcha-guard';
export const routes: Routes = [
 
  {
    path:      '',
    component: Home,
    // no guard — anyone can visit home
  },
 
  {
    path:      'captcha',
    component: Captcha,
    // no guard — anyone can start the challenge
  },
 
  {
    path:         'result',
    component:    Result,
    canActivate:  [captchaGuard],
    // captchaGuard runs BEFORE ResultComponent loads
    // if completed === false → redirects to /captcha automatically
  },
 
  {
    path:       '**',            // any unknown URL
    redirectTo: '',              // → go to home
  },
 
];
 

