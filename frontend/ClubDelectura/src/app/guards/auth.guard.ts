import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), 
    map(user => {
      if (user) {
        return true; 
      } else {
        console.log('AuthGuard: Usuario no autenticado, redirigiendo a /login');
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }); 
      }
    })
  );
};

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/');
}; 