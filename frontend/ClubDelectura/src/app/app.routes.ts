import { Routes } from '@angular/router';
import { LoginComponent } from './views/usuario/login/login.component';
import { RegistroComponent } from './views/usuario/registro/registro.component';
import { PerfilComponent } from './views/usuario/perfil/perfil.component';
import { ListadoComponent as ForoListadoComponent } from './views/foro/listado/listado.component';
import { NuevoComponent as ForoNuevoComponent } from './views/foro/nuevo/nuevo.component';
import { DetalleComponent as ForoDetalleComponent } from './views/foro/detalle/detalle.component';
import { ListadoComponent as EventoListadoComponent } from './views/evento/listado/listado.component';
import { NuevoComponent as EventoNuevoComponent } from './views/evento/nuevo/nuevo.component';
import { DetalleComponent as EventoDetalleComponent } from './views/evento/detalle/detalle.component';
import { ListadoComponent as LibroListadoComponent } from './views/libro/listado/listado.component';
import { NuevoComponent as LibroNuevoComponent } from './views/libro/nuevo/nuevo.component';
import { DetalleComponent as LibroDetalleComponent } from './views/libro/detalle/detalle.component';
import { ListadoComponent as LecturaListadoComponent } from './views/lectura/listado/listado.component';
import { DetalleComponent as LecturaDetalleComponent } from './views/lectura/detalle/detalle.component';
import { ListadoComponent as RecomendacionListadoComponent } from './views/recomendacion/listado/listado.component';
import { ListadoComponent as UsuarioListadoComponent } from './views/usuario/listado/listado.component';
import { DetalleComponent as UsuarioDetalleComponent } from './views/usuario/detalle/detalle.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { ContactoComponent } from './views/contacto/contacto.component';

export const routes: Routes = [
  { path: '', redirectTo: '/libro', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [loginGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'foro', component: ForoListadoComponent, canActivate: [authGuard] },
  { path: 'foro/nuevo', component: ForoNuevoComponent },
  { path: 'foro/:id', component: ForoDetalleComponent, canActivate: [authGuard] },
  { path: 'evento', component: EventoListadoComponent, canActivate: [authGuard] },
  { path: 'evento/nuevo', component: EventoNuevoComponent },
  { path: 'evento/:id', component: EventoDetalleComponent, canActivate: [authGuard] },
  { path: 'libro', component: LibroListadoComponent, canActivate: [authGuard] },
  { path: 'libro/nuevo', component: LibroNuevoComponent },
  { path: 'libro/:id', component: LibroDetalleComponent, canActivate: [authGuard] },
  { path: 'lectura', component: LecturaListadoComponent, canActivate: [authGuard] },
  { path: 'lectura/:id', component: LecturaDetalleComponent, canActivate: [authGuard] },
  { path: 'recomendacion', component: RecomendacionListadoComponent, canActivate: [authGuard] },
  { path: 'usuario', component: UsuarioListadoComponent, canActivate: [authGuard, adminGuard] },
  { path: 'usuario/:id', component: UsuarioDetalleComponent, canActivate: [authGuard, adminGuard] },
  { path: 'contacto', component: ContactoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
