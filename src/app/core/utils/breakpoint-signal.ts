import { DestroyRef, inject, signal, Signal } from '@angular/core';

/** Mobile is everything below the 768px tablet breakpoint used by the SCSS layouts. */
export const MOBILE_QUERY = '(max-width: 767.98px)';

/**
 * Creates a read-only boolean signal that tracks whether a CSS media query matches,
 * e.g. `breakpointSignal(MOBILE_QUERY)`.
 *
 * The signal starts with the query's current state and stays in sync while the window
 * is resized. The `change` listener is removed when the calling context is destroyed.
 *
 * Must be called inside an injection context (e.g. a field initializer or constructor).
 */
export function breakpointSignal(query: string): Signal<boolean> {
  const mediaQuery = window.matchMedia(query);
  const matches = signal(mediaQuery.matches);

  const onChange = (event: MediaQueryListEvent) => matches.set(event.matches);
  mediaQuery.addEventListener('change', onChange);
  inject(DestroyRef).onDestroy(() => mediaQuery.removeEventListener('change', onChange));

  return matches.asReadonly();
}
