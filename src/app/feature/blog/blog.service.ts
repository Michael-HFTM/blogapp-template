import { inject, Service } from '@angular/core';
import { Blog, BlogResponse } from './blog.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Service()
export class BlogService {
  private http = inject(HttpClient);

  public async getBlogs(): Promise<BlogResponse> {
    return firstValueFrom(this.http.get<BlogResponse>(environment.api + '/entries'));
  }

  public async getById(id: number): Promise<Blog | undefined> {
    return firstValueFrom(this.http.get<Blog>(environment.api + '/entries/' + id));
  }

  public async like(id: number): Promise<void> {
    await firstValueFrom(this.http.post(environment.api + '/entries/' + id + '/like-info', {}));
  }
}
