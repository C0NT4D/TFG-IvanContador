import { Routes } from '@angular/router';
import { LoginComponent } from './views/usuario/login/login.component';
import { RegistroComponent } from './views/usuario/registro/registro.component';
import { ListadoComponent as LibroListadoComponent } from './views/libro/listado/listado.component';
import { DetalleComponent as LibroDetalleComponent } from './views/libro/detalle/detalle.component';
import { NuevoComponent as LibroNuevoComponent } from './views/libro/nuevo/nuevo.component';
import { ListadoComponent as ForoListadoComponent } from './views/foro/listado/listado.component';
import { DetalleComponent as ForoDetalleComponent } from './views/foro/detalle/detalle.component';
import { NuevoComponent as ForoNuevoComponent } from './views/foro/nuevo/nuevo.component';
import { ListadoComponent as EventoListadoComponent } from './views/evento/listado/listado.component';
import { DetalleComponent as EventoDetalleComponent } from './views/evento/detalle/detalle.component';
import { NuevoComponent as EventoNuevoComponent } from './views/evento/nuevo/nuevo.component';
import { ListadoComponent as RecomendacionListadoComponent } from './views/recomendacion/listado/listado.component';
import { PerfilComponent } from './views/usuario/perfil/perfil.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'libros', component: LibroListadoComponent, canActivate: [authGuard] },
  { path: 'libros/:id', component: LibroDetalleComponent, canActivate: [authGuard] },
  { path: 'libros/nuevo', component: LibroNuevoComponent, canActivate: [authGuard] },
  { path: 'foros', component: ForoListadoComponent, canActivate: [authGuard] },
  { path: 'foros/:id', component: ForoDetalleComponent, canActivate: [authGuard] },
  { path: 'foros/nuevo', component: ForoNuevoComponent, canActivate: [authGuard] },
  { path: 'eventos', component: EventoListadoComponent, canActivate: [authGuard] },
  { path: 'eventos/:id', component: EventoDetalleComponent, canActivate: [authGuard] },
  { path: 'eventos/nuevo', component: EventoNuevoComponent, canActivate: [authGuard] },
  { path: 'recomendaciones', component: RecomendacionListadoComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'usuarios', loadComponent: () => import('./views/usuario/listado/listado.component').then(m => m.ListadoComponent), canActivate: [adminGuard] }
];
