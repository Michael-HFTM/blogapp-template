import { Component, signal } from '@angular/core';
import { Blog } from '../../models/blog.model';
import blogData from '../../data/blogs.json';
import { BlogCard } from '../../shared/blog-card/blog-card';

@Component({
  selector: 'app-blog-list',
  imports: [BlogCard],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
})
export class BlogList {
  blogs = signal<Blog[]>(blogData as Blog[]);

  handleLike(blogId: number): void {
    this.blogs.update((blogs) =>
      blogs.map((blog) => (blog.id === blogId ? this.updateLikesOnBlog(blog) : blog)),
    );
  }

  private updateLikesOnBlog(blog: Blog): Blog {
    return {
      ...blog,
      likedByMe: !blog.likedByMe,
      likes: blog.likedByMe ? blog.likes - 1 : blog.likes + 1,
    };
  }
}
