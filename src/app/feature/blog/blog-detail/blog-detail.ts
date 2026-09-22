import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogDetail as BlogDetailModel } from '../blog.model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetail {
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);

  blog = input.required<BlogDetailModel>();

  /**
   * Zweistufiges Löschen statt `confirm()`: Der Dialog des Browsers blockiert den
   * Thread und lässt sich im E2E-Test nur umständlich bedienen.
   */
  protected readonly confirmingDelete = signal(false);
  protected readonly deleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  async deleteBlog(): Promise<void> {
    this.deleting.set(true);
    this.deleteError.set(null);

    const ok = await this.blogService.deleteBlog(this.blog().id);

    this.deleting.set(false);

    if (!ok) {
      // Auf der Detailseite bleiben: der Blog existiert noch.
      this.confirmingDelete.set(false);
      this.deleteError.set('Der Blog konnte nicht gelöscht werden. Bitte versuche es erneut.');
      return;
    }

    await this.router.navigate(['/']);
  }
}
