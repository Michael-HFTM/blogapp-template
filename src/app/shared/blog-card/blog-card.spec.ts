import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Blog } from '../../feature/blog/blog.model';
import { BlogCard } from './blog-card';

const blog: Blog = {
  id: 7,
  title: 'Angular Signals',
  contentPreview: 'Signals im Überblick',
  author: 'alice',
  likes: 3,
  comments: 2,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

describe('BlogCard', () => {
  let fixture: ComponentFixture<BlogCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(BlogCard);
    fixture.componentRef.setInput('blog', blog);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows title, author and preview', () => {
    expect(element.querySelector('mat-card-title')?.textContent).toBe('Angular Signals');
    expect(element.querySelector('mat-card-subtitle')?.textContent).toBe('alice');
    expect(element.querySelector('mat-card-content')?.textContent).toContain(
      'Signals im Überblick',
    );
    expect(element.querySelector('.like-count')?.textContent).toBe('3');
  });

  it('shows a filled heart once the blog is liked', async () => {
    const icon = () => element.querySelector('button[aria-label="Like"] mat-icon')?.textContent;
    expect(icon()).toBe('favorite_border');

    fixture.componentRef.setInput('blog', { ...blog, likedByMe: true });
    await fixture.whenStable();

    expect(icon()).toBe('favorite');
  });

  it('emits the blog id when the like button is clicked', () => {
    const like = vi.fn();
    fixture.componentInstance.like.subscribe(like);

    element.querySelector<HTMLButtonElement>('button[aria-label="Like"]')!.click();

    expect(like).toHaveBeenCalledWith(7);
  });
});
