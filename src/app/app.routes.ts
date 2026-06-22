import { Routes } from '@angular/router';
import { BlogOverview } from './feature/blog-overview/blog-overview';

export const routes: Routes = [
  {
    path: '',
    component: BlogOverview,
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./feature/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about/about').then((m) => m.About),
  },
];
