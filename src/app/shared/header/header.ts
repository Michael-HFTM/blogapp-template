import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DOCUMENT } from '@angular/common';
import { breakpointSignal } from '../../core/utils/breakpoint-signal';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly document = inject(DOCUMENT);

  protected readonly isDark = signal(false);
  protected readonly isMobile = breakpointSignal(Breakpoints.Handset);

  constructor() {
    this.initTheme();
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
