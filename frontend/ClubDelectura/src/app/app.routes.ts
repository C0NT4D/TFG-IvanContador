import { Routes } from '@angular/router';
import { ListadoComponent } from './components/libro/listado/listado.component';
import { DetalleComponent } from './components/libro/detalle/detalle.component';
import { LoginComponent } from './components/usuario/login/login.component';
import { RegistroComponent } from './components/usuario/registro/registro.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'libros', pathMatch: 'full' },
  { path: 'libros', component: ListadoComponent },
  { path: 'libros/:id', component: DetalleComponent },
  { path: 'foros', component: ListadoComponent },
  { path: 'foros/:id', component: DetalleComponent },
  { path: 'eventos', component: ListadoComponent },
  { path: 'eventos/:id', component: DetalleComponent },
  { path: 'lecturas', component: ListadoComponent },
  { path: 'lecturas/:id', component: DetalleComponent },
  { path: 'recomendaciones', component: ListadoComponent },
  { path: 'recomendaciones/:id', component: DetalleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent }
];
