import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthorFilter } from '../author-filter/author-filter';
import { BlogList } from '../blog-list/blog-list';
import { BlogService } from '../blog.service';
import { BlogStateService } from '../blog-state/blog-state.service';

@Component({
  selector: 'app-blog-overview',
  imports: [MatProgressSpinnerModule, AuthorFilter, BlogList],
  templateUrl: './blog-overview.html',
  styleUrl: './blog-overview.scss',
})
export class BlogOverview implements OnInit {
  private readonly blogService = inject(BlogService);
  protected readonly state = inject(BlogStateService);

  protected readonly likeLoading = signal(false);

  protected readonly noResults = computed(
    () => this.state.filteredBlogs().length === 0 && !this.state.loading() && !this.state.error(),
  );

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
