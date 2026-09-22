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

  /**
   * Schaltet den Like optimistisch um: das Herz reagiert sofort, der Request läuft
   * danach. Scheitert er, wird die Änderung zurückgedreht — sonst zeigt die Liste
   * einen Like an, den der Server nie gespeichert hat.
   */
  public async toggleLike(id: number): Promise<void> {
    this.#likeToggled(id);

    const ok = await this.blogService.like(id);
    if (!ok) {
      this.#likeToggled(id);
      this.#errorRaised('Der Like konnte nicht gespeichert werden.');
    }
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

  #errorRaised(message: string): void {
    this.#state.update((state) => ({ ...state, error: message }));
  }

  /** Eigener Reducer statt Reload: ein Toggle ist sein eigenes Gegenteil. */
  #likeToggled(id: number): void {
    this.#state.update((state) => ({
      ...state,
      blogs: state.blogs.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              likedByMe: !blog.likedByMe,
              likes: blog.likes + (blog.likedByMe ? -1 : 1),
            }
          : blog,
      ),
    }));
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
