import { computed, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

interface UserInfo {
  preferred_username: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

@Service()
export class AuthStore {
  readonly #state = signal<AuthState>(initialState);

  /** Resolves once the initial session check finished — awaited by the auth guard. */
  readonly ready: Promise<void>;

  isAuthenticated = computed(() => this.#state().isAuthenticated);
  userData = computed(() => this.#state().user);
  loading = computed(() => this.#state().loading);
  roles = computed(() => this.#state().user?.roles ?? null);

  constructor() {
    this.ready = this.checkSession();
  }

  async checkSession(): Promise<void> {
    if (!environment.authEnabled) {
      this.#state.set({ ...initialState, loading: false });
      return;
    }

    try {
      const res = await fetch(`${environment.bffUrl}/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      this.#state.set({
        isAuthenticated: data.isAuthenticated,
        user: data.user,
        loading: false,
      });
    } catch {
      this.#state.set({ ...initialState, loading: false });
    }
  }

  /** Leaves the app: the BFF ends the session, Keycloak ends its SSO session. */
  async logout(): Promise<void> {
    try {
      const res = await fetch(`${environment.bffUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      const { logoutUrl } = await res.json();
      window.location.href = logoutUrl;
    } catch {
      window.location.href = '/';
    }
  }
}
