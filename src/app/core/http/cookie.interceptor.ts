import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const cookieInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.bffUrl)) {
    return next(
      req.clone({
        withCredentials: true,
        setHeaders: { 'X-Requested-With': 'XMLHttpRequest' },
      }),
    );
  }
  return next(req);
};
