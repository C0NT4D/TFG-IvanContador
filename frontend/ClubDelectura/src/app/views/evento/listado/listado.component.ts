import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
import { EventCardComponent } from '../../../components/event-card/event-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { AuthService } from '../../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-evento-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EventCardComponent,
    LoadingComponent,
    ErrorComponent,
    ConfirmModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  eventos: any[] = [];
  loading = true;
  error: string | null = null;
  showDeleteModal = false;
  eventoToDelete: number | null = null;
  isAdmin = false;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEventos();
    this.checkAdminStatus();
  }

  private loadEventos(): void {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
      }
    });
  }

  private checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
  }

  onDeleteEvento(id: number): void {
    this.eventoToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.eventoToDelete) {
      this.loading = true;
      this.eventoService.deleteEvento(this.eventoToDelete).subscribe({
        next: (success) => {
          if (success) {
            this.eventos = this.eventos.filter(evento => evento.id !== this.eventoToDelete);
          } else {
            this.error = 'No se pudo eliminar el evento';
          }
          this.loading = false;
          this.showDeleteModal = false;
          this.eventoToDelete = null;
        },
        error: (error) => {
          this.error = 'Error al eliminar el evento';
          this.loading = false;
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
