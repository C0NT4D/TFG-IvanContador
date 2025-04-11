import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        // Usuario ya logueado, redirigir fuera de login/registro
        console.log('LoginGuard: Usuario ya autenticado, redirigiendo a /libro');
        return router.createUrlTree(['/libro']); // Redirigir a libros
      } else {
        return true; // Usuario no logueado, permitir acceso a login/registro
      }
    })
  );
}; 