import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NuevoComponent as ForoNuevoComponent } from './views/foro/nuevo/nuevo.component';
import { NuevoComponent as EventoNuevoComponent } from './views/evento/nuevo/nuevo.component';
import { NuevoComponent as LibroNuevoComponent } from './views/libro/nuevo/nuevo.component';
import { ListadoComponent as ForoListadoComponent } from './views/foro/listado/listado.component';
import { ListadoComponent as EventoListadoComponent } from './views/evento/listado/listado.component';
import { ListadoComponent as LibroListadoComponent } from './views/libro/listado/listado.component';
import { DetalleComponent as ForoDetalleComponent } from './views/foro/detalle/detalle.component';
import { DetalleComponent as EventoDetalleComponent } from './views/evento/detalle/detalle.component';
import { DetalleComponent as LibroDetalleComponent } from './views/libro/detalle/detalle.component';
import { ForumCardComponent } from './components/forum-card/forum-card.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorComponent } from './components/error/error.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ForoNuevoComponent,
    EventoNuevoComponent,
    LibroNuevoComponent,
    ForoListadoComponent,
    EventoListadoComponent,
    LibroListadoComponent,
    ForoDetalleComponent,
    EventoDetalleComponent,
    LibroDetalleComponent,
    ForumCardComponent,
    EventCardComponent,
    BookCardComponent,
    LoadingComponent,
    ErrorComponent,
    ConfirmModalComponent
  ],
  providers: []
})
export class AppModule { } 