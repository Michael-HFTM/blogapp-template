import { Component } from '@angular/core';
import { Sidebar } from './core/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
