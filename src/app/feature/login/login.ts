import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Anmeldung wurde abgebrochen.',
  expired: 'Der Anmeldevorgang ist abgelaufen. Bitte versuche es erneut.',
  failed: 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.',
};

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  // Bound from the query string via withComponentInputBinding().
  readonly returnUrl = input('/');
  readonly error = input<string | undefined>();

  protected readonly errorMessage = computed(() => {
    const error = this.error();
    if (!error) return null;
    return ERROR_MESSAGES[error] ?? ERROR_MESSAGES['failed'];
  });

  /**
   * Full navigation, not a fetch — the browser has to follow the BFF's redirect
   * to Keycloak and carry the `__pkce` cookie back to the callback.
   */
  signIn(): void {
    const returnUrl = encodeURIComponent(this.returnUrl());
    window.location.href = `${environment.bffUrl}/auth/login?returnUrl=${returnUrl}`;
  }
}
