import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BlogDetail } from '../blog.model';
import { BlogService } from '../blog.service';

export const blogDetailResolver: ResolveFn<BlogDetail | undefined> = (route) => {
  const blogService = inject(BlogService);
  const id = Number(route.paramMap.get('id'));

  return blogService.getById(id);
};
