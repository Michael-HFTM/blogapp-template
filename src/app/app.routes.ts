import { Routes } from '@angular/router';
import { BlogOverview } from './feature/blog/blog-overview/blog-overview';
import { blogDetailResolver } from './feature/blog/blog-detail/blog-detail.resolver';
import { entriesResolver } from './feature/blog/blog-overview/entries-resolver';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverview,
    resolve: { blogs: entriesResolver },
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
    path: '**',
    loadComponent: () => import('./feature/error/error').then((m) => m.Error),
  },
];
