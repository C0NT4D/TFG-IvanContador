import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user && user.rol === 'admin') {
        return true; // Usuario es admin, permitir acceso
      } else {
        // Usuario no es admin (o no está logueado), redirigir
        console.log('AdminGuard: Acceso denegado, redirigiendo...');
        // Redirigir a una página principal o mostrar un error de acceso denegado
        return router.createUrlTree(['/libro']); // Redirigir a libros por defecto
      }
    })
  );
}; 