import { Component, input } from '@angular/core';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  blog = input.required<Blog>();
}
