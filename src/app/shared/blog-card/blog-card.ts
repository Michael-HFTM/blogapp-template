import { Component, input } from '@angular/core';
import { Blog } from '../../models/blog.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  blog = input.required<Blog>();
}
