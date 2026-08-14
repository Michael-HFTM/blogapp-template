import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';

export const authGuard: CanMatchFn = async (_route, segments: UrlSegment[]) => {
  const router = inject(Router);

  // This template's deployment target cannot host the BFF, so auth is off in
  // production — a protected route is simply unavailable rather than broken.
  if (!environment.authEnabled) {
    return router.createUrlTree(['/']);
  }

  const authStore = inject(AuthStore);
  await authStore.ready;

  if (authStore.isAuthenticated() && authStore.roles().includes('user')) {
    return true;
  }

  const returnUrl = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};

export default authGuard;
