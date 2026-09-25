import { TestBed } from '@angular/core/testing';
import { Blog } from '../blog.model';
import { BlogService } from '../blog.service';
import { BlogStateService } from './blog-state.service';

const blog = (id: number, author: string): Blog => ({
  id,
  title: `Blog ${id}`,
  contentPreview: '',
  author,
  likes: 0,
  comments: 0,
  likedByMe: false,
  createdByMe: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
});

describe('BlogStateService', () => {
  let blogService: { getAll: ReturnType<typeof vi.fn>; like: ReturnType<typeof vi.fn> };

  const createService = () => TestBed.inject(BlogStateService);

  beforeEach(() => {
    localStorage.clear();
    blogService = { getAll: vi.fn(), like: vi.fn() };
    TestBed.configureTestingModule({
      providers: [BlogStateService, { provide: BlogService, useValue: blogService }],
    });
  });

  describe('computed selectors', () => {
    it('start empty before anything is loaded', () => {
      const state = createService();
      expect(state.blogs()).toEqual([]);
      expect(state.blogCount()).toBe(0);
      expect(state.authors()).toEqual(['all']);
      expect(state.filteredBlogs()).toEqual([]);
    });

    it('recompute when blogs are loaded', async () => {
      const state = createService();
      blogService.getAll.mockResolvedValue([blog(1, 'anna'), blog(2, 'ben'), blog(3, 'anna')]);

      await state.loadBlogs();

      expect(state.blogCount()).toBe(3);
      expect(state.authors()).toEqual(['all', 'anna', 'ben']);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
    });

    it('filteredBlogs follows the selected author', async () => {
      const state = createService();
      blogService.getAll.mockResolvedValue([blog(1, 'anna'), blog(2, 'ben')]);
      await state.loadBlogs();

      expect(state.filteredBlogs().map((b) => b.id)).toEqual([1, 2]);

      state.setAuthor('ben');
      expect(state.filteredBlogs().map((b) => b.id)).toEqual([2]);

      state.setAuthor('nobody');
      expect(state.filteredBlogs()).toEqual([]);

      state.setAuthor('all');
      expect(state.filteredBlogs().map((b) => b.id)).toEqual([1, 2]);
    });

    it('handles an empty array from the API', async () => {
      const state = createService();
      blogService.getAll.mockResolvedValue([]);

      await state.loadBlogs();

      expect(state.blogs()).toEqual([]);
      expect(state.blogCount()).toBe(0);
      expect(state.authors()).toEqual(['all']);
      expect(state.error()).toBeNull();
    });

    it('sets an error and keeps blogs empty when the API returns undefined', async () => {
      const state = createService();
      blogService.getAll.mockResolvedValue(undefined);

      await state.loadBlogs();

      expect(state.blogs()).toEqual([]);
      expect(state.blogCount()).toBe(0);
      expect(state.loading()).toBe(false);
      expect(state.error()).toBe('Die Blogs konnten nicht geladen werden.');
    });

    it('reverts an optimistic like when the request fails', async () => {
      const state = createService();
      blogService.getAll.mockResolvedValue([blog(1, 'anna')]);
      await state.loadBlogs();
      blogService.like.mockResolvedValue(false);

      await state.toggleLike(1);

      expect(state.blogs()[0]).toMatchObject({ likes: 0, likedByMe: false });
      expect(state.error()).toBe('Der Like konnte nicht gespeichert werden.');
    });
  });

  describe('selectedAuthor', () => {
    it('defaults to "all" when nothing is stored (getItem returns null)', () => {
      expect(createService().selectedAuthor()).toBe('all');
    });

    it('restores the author from localStorage', () => {
      localStorage.setItem('selectedAuthor', 'anna');
      expect(createService().selectedAuthor()).toBe('anna');
    });
  });

  describe('persist effect', () => {
    it('writes the selected author to localStorage', () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem');
      const state = createService();

      TestBed.tick();
      expect(setItem).toHaveBeenLastCalledWith('selectedAuthor', 'all');

      state.setAuthor('ben');
      TestBed.tick();
      expect(setItem).toHaveBeenLastCalledWith('selectedAuthor', 'ben');
      expect(localStorage.getItem('selectedAuthor')).toBe('ben');

      setItem.mockRestore();
    });

    it('does not run again when the author is set to the same value', () => {
      const state = createService();
      TestBed.tick();
      const setItem = vi.spyOn(Storage.prototype, 'setItem');

      state.setAuthor('all');
      TestBed.tick();

      expect(setItem).not.toHaveBeenCalled();
      setItem.mockRestore();
    });
  });
});
