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

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'foro', component: ForoListadoComponent },
  { path: 'foro/nuevo', component: ForoNuevoComponent },
  { path: 'foro/:id', component: ForoDetalleComponent },
  { path: 'evento', component: EventoListadoComponent },
  { path: 'evento/nuevo', component: EventoNuevoComponent },
  { path: 'evento/:id', component: EventoDetalleComponent },
  { path: 'libro', component: LibroListadoComponent },
  { path: 'libro/nuevo', component: LibroNuevoComponent },
  { path: 'libro/:id', component: LibroDetalleComponent },
  { path: 'lectura', component: LecturaListadoComponent },
  { path: 'lectura/:id', component: LecturaDetalleComponent },
  { path: 'recomendacion', component: RecomendacionListadoComponent },
  { path: 'usuario', component: UsuarioListadoComponent },
  { path: 'usuario/:id', component: UsuarioDetalleComponent }
];
