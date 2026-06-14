import { Component } from '@angular/core';
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
  blogs: Blog[] = blogData as Blog[];
}
