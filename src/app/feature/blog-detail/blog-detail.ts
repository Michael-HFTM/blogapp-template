import { Component, computed, inject, input } from '@angular/core';
import { BlogService } from '../../shared/blog/blog';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  id = input.required<string>();
  private readonly blogService = inject(BlogService);

  protected readonly blog = computed(() => {
    const blogId = Number(this.id());
    return this.blogService.getById(blogId);
  });
}
