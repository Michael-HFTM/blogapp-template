import { Component, inject, input } from '@angular/core';
import { BlogCard } from '../../../shared/blog-card/blog-card';
import { BlogService } from '../blog.service';
import { Blog } from '../blog.model';

@Component({
  selector: 'app-blog-overview',
  imports: [BlogCard],
  templateUrl: './blog-overview.html',
  styleUrl: './blog-overview.scss',
})
export class BlogOverview {
  private readonly blogService = inject(BlogService);

  protected readonly blogs = input.required<Blog[]>();

  onLiked(blogId: number): void {
    this.blogService.like(blogId);
  }
}
