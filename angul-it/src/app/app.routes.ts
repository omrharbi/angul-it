// Client-side routing
import { Routes } from '@angular/router';
import { Captcha } from './pages/captcha/captcha';
import { Result } from './pages/result/result';
import { Home } from './pages/home/home';
import { captchaGuard } from './core/guards/captcha-guard';
export const routes: Routes = [
 
  {
    path:      '',
    component: Home,
  },
 
  {
    path:      'captcha',
    component: Captcha,
  },
 
  {
    path:         'result',
    component:    Result,
    canActivate:  [captchaGuard],
    // captchaGuard runs BEFORE ResultComponent loads
    // if completed === false → redirects to /captcha automatically
  },
 
  {
    path:       '**',
    redirectTo: '',
  },
 
];
 

