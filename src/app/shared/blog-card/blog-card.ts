import { Component, input } from '@angular/core';
import { Blog } from '../../models/blog.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  blog = input.required<Blog>();
}
