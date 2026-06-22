import { Component } from '@angular/core';
import { BlogList } from '../blog-list/blog-list';

@Component({
  selector: 'app-blog-overview',
  imports: [BlogList],
  templateUrl: './blog-overview.html',
  styleUrl: './blog-overview.scss',
})
export class BlogOverview {}
