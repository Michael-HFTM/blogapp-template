import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Profile {
  // The route's canMatch guard already awaited the session check, so the user
  // signal is populated by the time this component is created.
  protected readonly authStore = inject(AuthStore);
}
