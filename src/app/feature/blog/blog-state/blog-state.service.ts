import { computed, effect, inject, Service, signal } from '@angular/core';
import { Blog } from '../blog.model';
import { BlogService } from '../blog.service';

@Service()
export class BlogStateService {
  private blogService = inject(BlogService);

  constructor() {
    effect(() => {
      const selectedAuthor = this.selectedAuthor();
      localStorage.setItem('selectedAuthor', selectedAuthor);
    });
  }

  readonly #state = signal<BlogState>({
    blogs: [],
    loading: false,
    error: null,
    selectedAuthor: localStorage.getItem('selectedAuthor') ?? 'all',
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
    const blogs = await this.blogService.getAll();
    if (blogs === undefined) {
      this.#loadFailed('Die Blogs konnten nicht geladen werden.');
      return;
    }
    this.#loadSucceeded(blogs);
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
