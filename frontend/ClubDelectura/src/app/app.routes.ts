import { Routes } from '@angular/router';
import { ListadoComponent as LibroListadoComponent } from './views/libro/listado/listado.component';
import { DetalleComponent as LibroDetalleComponent } from './views/libro/detalle/detalle.component';
import { ListadoComponent as ForoListadoComponent } from './views/foro/listado/listado.component';
import { DetalleComponent as ForoDetalleComponent } from './views/foro/detalle/detalle.component';
import { NuevoComponent as ForoNuevoComponent } from './views/foro/nuevo/nuevo.component';
import { ListadoComponent as EventoListadoComponent } from './views/evento/listado/listado.component';
import { DetalleComponent as EventoDetalleComponent } from './views/evento/detalle/detalle.component';
import { NuevoComponent as EventoNuevoComponent } from './views/evento/nuevo/nuevo.component';
import { ListadoComponent as LecturaListadoComponent } from './views/lectura/listado/listado.component';
import { DetalleComponent as LecturaDetalleComponent } from './views/lectura/detalle/detalle.component';
import { ListadoComponent as RecomendacionListadoComponent } from './views/recomendacion/listado/listado.component';
import { LoginComponent } from './views/usuario/login/login.component';
import { RegistroComponent } from './views/usuario/registro/registro.component';
import { PerfilComponent } from './views/usuario/perfil/perfil.component';
import { ListadoComponent as UsuarioListadoComponent } from './views/usuario/listado/listado.component';
import { DetalleComponent as UsuarioDetalleComponent } from './views/usuario/detalle/detalle.component';
import { NuevoComponent } from './views/usuario/nuevo/nuevo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/libros', pathMatch: 'full' },
  { path: 'libros', component: LibroListadoComponent },
  { path: 'libros/:id', component: LibroDetalleComponent },
  { path: 'foros', component: ForoListadoComponent },
  { path: 'foros/nuevo', component: ForoNuevoComponent },
  { path: 'foros/:id', component: ForoDetalleComponent },
  { path: 'eventos', component: EventoListadoComponent },
  { path: 'eventos/nuevo', component: EventoNuevoComponent },
  { path: 'eventos/:id', component: EventoDetalleComponent },
  { path: 'lecturas', component: LecturaListadoComponent },
  { path: 'lecturas/:id', component: LecturaDetalleComponent },
  { path: 'recomendaciones', component: RecomendacionListadoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'usuarios', component: UsuarioListadoComponent },
  { path: 'usuarios/nuevo', component: NuevoComponent },
  { path: 'usuarios/:id', component: UsuarioDetalleComponent }
];
