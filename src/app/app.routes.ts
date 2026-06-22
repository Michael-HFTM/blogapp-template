import { Routes } from '@angular/router';
import { BlogOverview } from './feature/blog-overview/blog-overview';
import { blogDetailResolver } from './feature/blog-detail/blog-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverview,
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./feature/blog-detail/blog-detail').then((m) => m.BlogDetail),
    resolve: {
      blog: blogDetailResolver,
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about/about').then((m) => m.About),
  },
  {
    path: '**',
    loadComponent: () => import('./feature/error/error').then((m) => m.Error),
  },
];
