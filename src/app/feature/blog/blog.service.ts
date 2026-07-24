import { inject, Service } from '@angular/core';
import { Blog, BlogResponse } from './blog.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Service()
export class BlogService {
  private http = inject(HttpClient);

  public async getBlogs(): Promise<BlogResponse> {
    return firstValueFrom(this.http.get<BlogResponse>(`${environment.api}/entries`));
  }

  public async getById(id: number): Promise<Blog | undefined> {
    return firstValueFrom(this.http.get<Blog>(`${environment.api}/entries/${id}`));
  }

  public async like(id: number): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.api}/entries/${id}/like-info`, {}));
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
      return await firstValueFrom(this.http.put<Blog>(`${environment.api}/entries/${id}`, blog));
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
