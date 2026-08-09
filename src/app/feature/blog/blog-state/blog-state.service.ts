import { computed, inject, Service, signal } from '@angular/core';
import { Blog, BlogResponseSchema } from '../blog.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Service()
export class BlogStateService {
  private http = inject(HttpClient);

  readonly #state = signal<BlogState>({
    blogs: [],
    loading: false,
    error: null,
    selectedAuthor: 'all',
  });

  /** Selectors */
  public blogs = computed(() => this.#state().blogs);
  public loading = computed(() => this.#state().loading);
  public error = computed(() => this.#state().error);
  public blogCount = computed(() => this.#state().blogs.length);
  public selectedAuthor = computed(() => this.#state().selectedAuthor);

  public authors = computed(() => [
    'all',
    ...new Set(this.#state().blogs.map((blog) => blog.author)),
  ]);

  public filteredBlogs = computed(() => {
    if (this.selectedAuthor() === 'all') {
      return this.#state().blogs;
    }
    return this.#state().blogs.filter((blog) => blog.author === this.selectedAuthor());
  });

  /** Actions */
  public async loadBlogs(): Promise<void> {
    this.#loadStarted();
    try {
      const response = await firstValueFrom(this.http.get(`${environment.api}/entries`));
      const result = BlogResponseSchema.safeParse(response);
      if (!result.success) {
        console.error('Invalid blog list response', result.error);
        this.#loadFailed('Die Blogs konnten nicht geladen werden.');
        return;
      }
      this.#loadSucceeded(result.data.data);
    } catch (error) {
      console.error('Failed to load blogs', error);
      this.#loadFailed('Die Blogs konnten nicht geladen werden.');
    }
  }

  public setAuthor(author: string): void {
    this.#authorSelected(author);
  }

  /** Reducers */
  #loadStarted(): void {
    this.#state.update((state) => ({ ...state, loading: true, error: null }));
  }

  #loadSucceeded(blogs: Blog[]): void {
    this.#state.update((state) => ({ ...state, blogs, loading: false }));
  }

  #loadFailed(message: string): void {
    this.#state.update((state) => ({ ...state, loading: false, error: message }));
  }

  #authorSelected(author: string): void {
    this.#state.update((state) => ({ ...state, selectedAuthor: author }));
  }
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  selectedAuthor: string;
}
