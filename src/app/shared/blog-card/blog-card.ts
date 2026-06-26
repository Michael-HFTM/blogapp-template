import { Component, input, output } from '@angular/core';
import { Blog } from '../../feature/blog/blog.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-card',
  imports: [MatCardModule, MatButtonModule, MatIcon, RouterLink],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss',
})
export class BlogCard {
  blog = input.required<Blog>();
  like = output<number>();

  emitLike() {
    this.like.emit(this.blog().id);
  }
}
