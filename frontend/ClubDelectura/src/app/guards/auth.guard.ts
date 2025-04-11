import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos currentUser$ para reaccionar a cambios de login/logout
  return authService.currentUser$.pipe(
    take(1), // Tomar solo el valor actual y completar
    map(user => {
      if (user) {
        return true; // Usuario logueado, permitir acceso
      } else {
        // Usuario no logueado, redirigir a login
        console.log('AuthGuard: Usuario no autenticado, redirigiendo a /login');
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }); // Guardar URL original
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