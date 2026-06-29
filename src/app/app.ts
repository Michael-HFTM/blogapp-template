import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly title = 'HFTM Web Applications (IN353)';
  protected readonly isDark = signal(false);

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
      // No saved preference — respect OS setting
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.isDark.set(isDark);

    if (isDark) {
      this.document.documentElement.classList.add('dark-theme');
    } else if (saved === 'light') {
      // User explicitly chose light — add class to override system dark preference
      this.document.documentElement.classList.add('light-theme');
    }
    // No saved preference + system is light → no class needed, CSS default handles it
  }

  toggleTheme(): void {
    this.isDark.update((dark) => !dark);
    const isDark = this.isDark();

    this.document.documentElement.classList.toggle('dark-theme', isDark);
    this.document.documentElement.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
