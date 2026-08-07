import { inject, Service } from '@angular/core';
import { Blog, BlogDetail, BlogDetailSchema, BlogResponse, BlogResponseSchema } from './blog.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Service()
export class BlogService {
  private http = inject(HttpClient);

  public async getBlogs(): Promise<BlogResponse> {
    try {
      const response = await firstValueFrom(this.http.get(`${environment.api}/entries`));
      const result = BlogResponseSchema.safeParse(response);
      if (!result.success) {
        console.error('Invalid blog list response', result.error);
        return { data: [], totalCount: 0, pageIndex: 0, pageSize: 0, maxPageSize: 0 };
      }
      return result.data;
    } catch (error) {
      console.error('Failed to load blogs', error);
      return { data: [], totalCount: 0, pageIndex: 0, pageSize: 0, maxPageSize: 0 };
    }
  }

  public async getById(id: number): Promise<BlogDetail | undefined> {
    try {
      const response = await firstValueFrom(this.http.get(`${environment.api}/entries/${id}`));
      const result = BlogDetailSchema.safeParse(response);
      if (!result.success) {
        console.error(`Invalid blog response for id ${id}`, result.error);
        return undefined;
      }
      return result.data;
    } catch (error) {
      console.error(`Failed to load blog ${id}`, error);
      return undefined;
    }
  }

  public async like(id: number): Promise<void> {
    await firstValueFrom(this.http.put(`${environment.api}/entries/${id}/like-info`, {}));
  }

  public async createBlog(blog: Blog): Promise<Blog | undefined> {
    try {
      return await firstValueFrom(this.http.post<Blog>(`${environment.api}/entries`, blog));
    } catch (error) {
      console.error('Failed to create blog', error);
      return undefined;
    }
  }

  public async updateBlog(id: number, blog: Blog): Promise<Blog | undefined> {
    try {
      return await firstValueFrom(this.http.patch<Blog>(`${environment.api}/entries/${id}`, blog));
    } catch (error) {
      console.error(`Failed to update blog ${id}`, error);
      return undefined;
    }
  }

  public async deleteBlog(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${environment.api}/entries/${id}`));
    } catch (error) {
      console.error(`Failed to delete blog ${id}`, error);
    }
  }
}
