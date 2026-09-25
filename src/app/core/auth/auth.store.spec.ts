import { TestBed } from '@angular/core/testing';
import { AuthStore, UserInfo } from './auth.store';

const user = (roles: string[]): UserInfo => ({
  preferred_username: 'max',
  email: 'max@example.com',
  name: 'Max',
  roles,
});

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(async () => {
    store = TestBed.inject(AuthStore);
    // authEnabled is false in the test environment, so this resolves without a fetch.
    await store.ready;
  });

  describe('roles', () => {
    it('is an empty array when user is null', () => {
      store.user.set(null);
      expect(store.roles()).toEqual([]);
    });

    it('is an empty array when the user has no roles property', () => {
      store.user.set({ ...user([]), roles: undefined } as unknown as UserInfo);
      expect(store.roles()).toEqual([]);
    });

    it('is an empty array when the user has an empty roles array', () => {
      store.user.set(user([]));
      expect(store.roles()).toEqual([]);
    });

    it('follows the user signal', () => {
      store.user.set(user(['user']));
      expect(store.roles()).toEqual(['user']);

      store.user.set(user(['user', 'admin']));
      expect(store.roles()).toEqual(['user', 'admin']);

      store.user.set(null);
      expect(store.roles()).toEqual([]);
    });
  });
});
