import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventCardComponent } from '../../../components/event-card/event-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { EventoService } from '../../../services/evento.service';
import { AuthService } from '../../../services/auth.service';
import { Evento } from '../../../models/evento.model';
import { Inscripcion } from '../../../models/inscripcion.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    EventCardComponent,
    LoadingComponent,
    ErrorComponent,
    ConfirmModalComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  eventos: any[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;
  showAddForm = false;
  showDeleteModal = false;
  eventoToDelete: number | null = null;
  eventoForm: FormGroup;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', [Validators.required]],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadEventos();
    this.checkAdminStatus();
  }

  private loadEventos(): void {
    this.loading = true;
    this.error = null;
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  private checkAdminStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
  }

  openAddEvent(): void {
    this.showAddForm = true;
  }

  onCancel(): void {
    this.showAddForm = false;
    this.eventoForm.reset();
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = 'Debes estar autenticado para crear un evento';
        return;
      }

      const eventoData: Omit<Evento, 'id' | 'inscripcions'> & { inscripcions?: Inscripcion[] } = {
        titulo: this.eventoForm.get('titulo')?.value,
        descripcion: this.eventoForm.get('descripcion')?.value,
        fecha: new Date(this.eventoForm.get('fecha')?.value),
        ubicacion: this.eventoForm.get('ubicacion')?.value,
        organizador: currentUser,
        inscripcions: []
      };

      this.eventoService.createEvento(eventoData).subscribe({
        next: (evento) => {
          this.loadEventos();
          this.showAddForm = false;
          this.eventoForm.reset();
        },
        error: (err) => {
          this.error = 'Error al crear el evento';
          console.error('Error creating event:', err);
        }
      });
    }
  }

  onDeleteEvento(eventoId: number): void {
    this.eventoToDelete = eventoId;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.eventoToDelete) {
      this.eventoService.deleteEvento(this.eventoToDelete).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== this.eventoToDelete);
          this.showDeleteModal = false;
          this.eventoToDelete = null;
        },
        error: (err) => {
          this.error = 'Error al eliminar el evento';
          console.error('Error deleting event:', err);
          this.showDeleteModal = false;
          this.eventoToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.eventoToDelete = null;
  }
}
