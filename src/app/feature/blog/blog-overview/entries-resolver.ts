import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BlogService } from '../blog.service';
import { Blog } from '../blog.model';

export const entriesResolver: ResolveFn<Promise<Blog[]>> = async () => {
  const blogService = inject(BlogService);
  const blogResponse = await blogService.getBlogs();
  return blogResponse.data;
};
