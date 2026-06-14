import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BlogList } from './feature/blog-list/blog-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, BlogList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'HFTM Web Applications (IN353)';
}
