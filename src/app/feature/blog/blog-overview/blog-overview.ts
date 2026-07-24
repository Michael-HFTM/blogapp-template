import { Component, inject, input, signal } from '@angular/core';
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
  protected readonly loading = signal(false);

  async onLiked(blogId: number): Promise<void> {
    this.loading.set(true);
    try {
      await this.blogService.like(blogId);
    } finally {
      this.loading.set(false);
    }
  }
}
