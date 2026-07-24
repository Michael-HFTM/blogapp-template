import { Service } from '@angular/core';
import blogData from '../../data/blogs.json';
import { Blog } from './blog.model';

@Service()
export class BlogService {
  public getBlogs(): Blog[] {
    return blogData as Blog[];
  }

  public getById(id: number): Blog | undefined {
    return (blogData as Blog[]).find((blog) => blog.id === id);
  }
}
