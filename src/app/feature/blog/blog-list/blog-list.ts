import { Component, input, output } from '@angular/core';
import { Blog } from '../blog.model';
import { BlogCard } from '../../../shared/blog-card/blog-card';

@Component({
  selector: 'app-blog-list',
  imports: [BlogCard],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  blogs = input.required<Blog[]>();
  showEmpty = input(false);
  like = output<number>();
}
