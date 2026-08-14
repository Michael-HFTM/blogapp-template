import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserInfo {
  preferred_username: string;
  email: string;
  name: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly isAuthenticated = signal(false);
  readonly user = signal<UserInfo | null>(null);
  /** Starts as `true`: the session check is already running when the app boots. */
  readonly loading = signal(true);

  readonly roles = computed(() => this.user()?.roles ?? []);

  /** Resolves once the initial session check finished — awaited by the auth guard. */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.checkSession();
  }

  async checkSession(): Promise<void> {
    if (!environment.authEnabled) {
      this.#reset();
      return;
    }

    try {
      const res = await fetch(`${environment.bffUrl}/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      this.isAuthenticated.set(data.isAuthenticated ?? false);
      this.user.set(data.user ?? null);
    } catch {
      this.isAuthenticated.set(false);
      this.user.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Leaves the app: the BFF ends the session, then Keycloak ends its SSO session.
   * There is deliberately no `login()` counterpart — signing in is a full browser
   * navigation to the BFF (see the login page), not a fetch.
   */
  async logout(): Promise<void> {
    try {
      const res = await fetch(`${environment.bffUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      const { logoutUrl } = await res.json();
      this.#reset();
      window.location.href = logoutUrl;
    } catch {
      this.#reset();
      window.location.href = '/';
    }
  }

  #reset(): void {
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.loading.set(false);
  }
}
