import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BlogCard } from '../../../shared/blog-card/blog-card';
import { BlogService } from '../blog.service';
import { BlogStateService } from '../blog-state/blog-state.service';

@Component({
  selector: 'app-blog-overview',
  imports: [BlogCard, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './blog-overview.html',
  styleUrl: './blog-overview.scss',
})
export class BlogOverview implements OnInit {
  private readonly blogService = inject(BlogService);
  protected readonly state = inject(BlogStateService);

  protected readonly likeLoading = signal(false);

  ngOnInit(): void {
    this.state.loadBlogs();
  }

  onAuthorChange(author: string): void {
    this.state.setAuthor(author);
  }

  async onLiked(blogId: number): Promise<void> {
    this.likeLoading.set(true);
    try {
      await this.blogService.like(blogId);
    } finally {
      this.likeLoading.set(false);
    }
  }
}
