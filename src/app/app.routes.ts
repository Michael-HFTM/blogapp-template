import { Routes } from '@angular/router';
import { BlogOverview } from './feature/blog/blog-overview/blog-overview';
import { blogDetailResolver } from './feature/blog/blog-detail/blog-detail.resolver';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverview,
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./feature/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
    resolve: {
      blog: blogDetailResolver,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about/about').then((m) => m.About),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login'),
  },
  {
    path: 'profile',
    // canMatch, not canActivate: an anonymous visitor never downloads the chunk.
    canMatch: [authGuard],
    loadComponent: () => import('./feature/profile/profile'),
  },
  {
    path: '**',
    loadComponent: () => import('./feature/error/error').then((m) => m.Error),
  },
];
