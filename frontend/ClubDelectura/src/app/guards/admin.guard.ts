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
        return true; 
      } else {
        console.log('AdminGuard: Acceso denegado, redirigiendo...');
        return router.createUrlTree(['/libro']); 
      }
    })
  );
}; 