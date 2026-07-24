import { Component, inject, signal } from '@angular/core';
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

  protected readonly blogs = signal<Blog[]>(this.blogService.getBlogs());

  handleLike(blogId: number): void {
    this.blogs.update((blogs) =>
      blogs.map((blog) => (blog.id === blogId ? this.toggleLike(blog) : blog)),
    );
  }

  private toggleLike(blog: Blog): Blog {
    return {
      ...blog,
      likedByMe: !blog.likedByMe,
      likes: blog.likedByMe ? blog.likes - 1 : blog.likes + 1,
    };
  }
}
