// ─────────────────────────────────────────────────────────────
//  captcha.guard.ts
//  Protects the /result route
//  If user hasn't completed all stages → redirect to /captcha
// ─────────────────────────────────────────────────────────────

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
export const captchaGuard: CanActivateFn = () => {

  const router = inject(Router);
  
  // SSR-safe: localStorage doesn't exist on server
  if (typeof localStorage === 'undefined') {
    return true; // Allow on server-side, client will check
  }
  
  // read state from localStorage directly
  const raw = localStorage.getItem('angul_it_state');

  if (!raw) {
    return router.createUrlTree(['/captcha']);
  }

  try {
    const state = JSON.parse(raw);

    if (state.completed === true) {
      return true;
    } else {
      return router.createUrlTree(['/captcha']);
    }
  } catch {
    return router.createUrlTree(['/captcha']);
  }
};