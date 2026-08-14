import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';

/**
 * Guards a route behind one or more realm roles. Anonymous visitors are sent to
 * the login page; visitors who are signed in but lack the role go home, because
 * showing them a login form again would suggest a fix that does not exist.
 */
export const roleGuard =
  (...allowedRoles: string[]): CanMatchFn =>
  async (_route, segments: UrlSegment[]) => {
    const router = inject(Router);

    if (!environment.authEnabled) {
      return router.createUrlTree(['/']);
    }

    const authStore = inject(AuthStore);
    await authStore.ready;

    if (!authStore.isAuthenticated()) {
      const returnUrl = '/' + segments.map((s) => s.path).join('/');
      return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
    }

    const roles = authStore.roles();
    if (allowedRoles.some((role) => roles.includes(role))) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
