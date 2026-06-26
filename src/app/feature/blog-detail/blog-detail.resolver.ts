import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Blog } from '../../models/blog.model';
import { BlogService } from '../../shared/blog/blog';

export const blogDetailResolver: ResolveFn<Blog | undefined> = (route) => {
  const blogService = inject(BlogService);
  const id = Number(route.paramMap.get('id'));

  return blogService.getById(id);
};
