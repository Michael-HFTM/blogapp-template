import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { breakpointSignal, MOBILE_QUERY } from '../utils/breakpoint-signal';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth.store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
})
export class Sidebar {
  private readonly document = inject(DOCUMENT);
  protected readonly authStore = inject(AuthStore);

  protected readonly authEnabled = environment.authEnabled;
  /** Mirrors the roleGuard on /blog/create — the guard stays the actual gate. */
  protected readonly canCreateBlog = computed(() => this.authStore.roles().includes('user'));
  protected readonly isDark = signal(false);
  protected readonly isMobile = breakpointSignal(MOBILE_QUERY);

  /**
   * Offen-Zustand der mobilen Sidenav. Bewusst ein Signal statt einer
   * `#drawer`-Template-Referenz: Sidenav und Burger-Button liegen in zwei
   * getrennten `@if`-Blöcken, und über diese Grenze hinweg löst Angular keine
   * Template-Referenz auf.
   */
  protected readonly drawerOpen = signal(false);

  constructor() {
    this.initTheme();

    // Beim Wechsel auf Desktop verschwindet die Sidenav aus dem DOM. Ohne Reset
    // stünde sie beim Zurückwechseln auf Mobile unvermittelt offen.
    effect(() => {
      if (!this.isMobile()) {
        this.drawerOpen.set(false);
      }
    });
  }

  logout(): void {
    // Navigates away to Keycloak's end-session endpoint, so no router call here.
    void this.authStore.logout();
  }

  private initTheme(): void {
    const saved = localStorage.getItem('theme');
    let isDark: boolean;

    if (saved === 'dark') {
      isDark = true;
    } else if (saved === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }

    this.isDark.set(isDark);

    if (isDark) {
      this.document.documentElement.classList.add('dark-theme');
    } else if (saved === 'light') {
      this.document.documentElement.classList.add('light-theme');
    }
  }

  toggleTheme(): void {
    this.isDark.update((dark) => !dark);
    const isDark = this.isDark();
    this.document.documentElement.classList.toggle('dark-theme', isDark);
    this.document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
