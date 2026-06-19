import { Service, signal } from '@angular/core';
import blogData from '../../data/blogs.json';
import { Blog } from '../../models/blog.model';

@Service()
export class BlogService {
  private readonly blogs = signal<Blog[]>(blogData as Blog[]);

  public getAll() {
    return this.blogs.asReadonly();
  }

  public getById(id: number) {
    return this.blogs().find((blog) => blog.id === id);
  }

  public handleLike(blogId: number): void {
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
