import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Blog } from '../blog.model';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, MatIconModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  blog = input.required<Blog>();
}
