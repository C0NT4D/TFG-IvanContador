import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { InscripcionService } from '../../../services/inscripcion.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { InscriptionCardComponent } from '../../../components/inscription-card/inscription-card.component';

@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingComponent,
    ErrorComponent,
    InscriptionCardComponent
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  evento: any = null;
  inscripciones: any[] = [];
  loading = true;
  error: string | null = null;
  currentUserId = 1; // TODO: Get from auth service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private inscripcionService: InscripcionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvento(parseInt(id));
    }
  }

  private loadEvento(id: number): void {
    this.loading = true;
    this.error = null;
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
    this.inscripcionService.getInscripcionsByEvento(eventoId).subscribe({
      next: (inscripciones) => {
        this.inscripciones = inscripciones;
      },
      error: (error) => {
        console.error('Error al cargar las inscripciones:', error);
      }
    });
  }

  inscribirse(): void {
    if (!this.evento) return;

    const inscripcion = {
      evento: this.evento,
      usuario: {
        id: this.currentUserId
      } as any // TODO: Replace with proper type when auth service is implemented
    };

    this.inscripcionService.createInscripcion(inscripcion).subscribe({
      next: (inscripcion) => {
        this.inscripciones.push(inscripcion);
      },
      error: (error) => {
        this.error = 'Error al inscribirse en el evento';
      }
    });
  }

  cancelarInscripcion(): void {
    if (!this.evento) return;

    const inscripcion = this.inscripciones.find(i => i.usuario.id === this.currentUserId);
    if (inscripcion) {
      this.inscripcionService.deleteInscripcion(inscripcion.id).subscribe({
        next: () => {
          this.inscripciones = this.inscripciones.filter(i => i.id !== inscripcion.id);
        },
        error: (error) => {
          this.error = 'Error al cancelar la inscripción';
        }
      });
    }
  }

  isInscrito(): boolean {
    return this.inscripciones.some(i => i.usuario.id === this.currentUserId);
  }
}
