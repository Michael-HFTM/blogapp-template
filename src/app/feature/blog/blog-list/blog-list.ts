import { Component, inject } from '@angular/core';
import { BlogCard } from '../../../shared/blog-card/blog-card';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  imports: [BlogCard],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  private readonly blogService = inject(BlogService);

  blogs = this.blogService.getAll();

  handleLike(blogId: number): void {
    this.blogService.handleLike(blogId);
  }
}
