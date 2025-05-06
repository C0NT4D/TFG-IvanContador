import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  evento: any = null;
  inscripciones: any[] = [];
  loading = true;
  error = '';
  currentUserId: number | null = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private inscripcionService: InscripcionService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;
    this.currentUser = currentUser;
    
    if (!this.currentUserId) {
      this.error = 'Debe iniciar sesión para ver los detalles del evento';
      this.loading = false;
      return;
    }
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvento(id);
  }

  private loadEvento(id: number): void {
    this.loading = true;
    this.eventoService.getEvento(id).subscribe({
      next: (evento) => {
        if (evento) {
          this.evento = evento;
          this.loadInscripciones(id);
          this.loading = false;
        } else {
          this.error = 'Evento no encontrado';
          this.loading = false;
        }
      },
      error: (error) => {
        this.error = 'Error al cargar el evento';
        this.loading = false;
      }
    });
  }

  private loadInscripciones(eventoId: number): void {
    this.inscripcionService.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(i => {
        const inscripcionEventoId = typeof i.evento === 'object' ? i.evento.id : i.evento;
        return inscripcionEventoId === eventoId;
      })),
      switchMap(inscripciones => {
        if (inscripciones.length === 0) return of([]);
        
        const inscripcionesCompletas = inscripciones.map(inscripcion => {
          if (typeof inscripcion.usuario === 'object' && inscripcion.usuario.nombre) {
            return of(inscripcion);
          }

          const usuarioId = typeof inscripcion.usuario === 'object' ? inscripcion.usuario.id : inscripcion.usuario;
          return this.usuarioService.getUsuario(usuarioId).pipe(
            map(usuario => {
              return {
                ...inscripcion,
                usuario: usuario || { id: usuarioId, nombre: 'Usuario no encontrado' }
              };
            }),
            catchError(() => {
              return of({
                ...inscripcion,
                usuario: { id: usuarioId, nombre: 'Error al cargar usuario' }
              });
            })
          );
        });
        
        return forkJoin(inscripcionesCompletas);
      })
    ).subscribe({
      next: (inscripciones) => {
        console.log('Inscripciones cargadas:', inscripciones);
        this.inscripciones = inscripciones;
      },
      error: (error) => {
        console.error('Error al cargar las inscripciones:', error);
      }
    });
  }

  inscribirse(): void {
    if (!this.evento || !this.currentUserId) return;

    const inscripcion = {
      evento_id: this.evento.id,
      usuario_id: this.currentUserId
    };

    this.inscripcionService.createInscripcion(inscripcion).subscribe({
      next: (nuevaInscripcion) => {
        const inscripcionCompleta = {
          ...nuevaInscripcion,
          usuario: this.currentUser || { 
            id: this.currentUserId, 
            nombre: 'Usuario actual'
          }
        };
        
        console.log('Nueva inscripción:', inscripcionCompleta);
        this.inscripciones.push(inscripcionCompleta);
      },
      error: (error) => {
        this.error = 'Error al inscribirse en el evento';
        console.error('Error al inscribirse:', error);
      }
    });
  }

  cancelarInscripcion(): void {
    if (!this.evento || !this.currentUserId) return;

    const inscripcion = this.inscripciones.find(i => {
      const usuarioId = typeof i.usuario === 'object' ? i.usuario.id : i.usuario;
      return usuarioId === this.currentUserId;
    });
    
    if (inscripcion) {
      this.inscripcionService.deleteInscripcion(inscripcion.id).subscribe({
        next: () => {
          this.inscripciones = this.inscripciones.filter(i => i.id !== inscripcion.id);
        },
        error: (error) => {
          this.error = 'Error al cancelar la inscripción';
          console.error('Error al cancelar inscripción:', error);
        }
      });
    }
  }

  isInscrito(): boolean {
    if (!this.currentUserId) return false;
    
    return this.inscripciones.some(i => {
      const usuarioId = typeof i.usuario === 'object' ? i.usuario.id : i.usuario;
      return usuarioId === this.currentUserId;
    });
  }
}
