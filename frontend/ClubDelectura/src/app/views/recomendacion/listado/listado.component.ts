import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecomendacionService } from '@app/services/recomendacion.service';
import { AuthService } from '@app/services/auth.service';
import { RecommendationCardComponent } from '@app/components/recommendation-card/recommendation-card.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';
import { ConfirmModalComponent } from '@app/components/confirm-modal/confirm-modal.component';
import { RecomendacionFormComponent } from '@app/components/recomendacion-form/recomendacion-form.component';
import { Recomendacion } from '@app/models/recomendacion.model';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RecommendationCardComponent,
    LoadingComponent,
    ErrorComponent,
    ConfirmModalComponent,
    RecomendacionFormComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  recomendaciones: Recomendacion[] = [];
  loading = true;
  error: string | null = null;
  showDeleteModal = false;
  showAddForm = false;
  recomendacionToDelete: number | null = null;
  isAdmin = false;

  constructor(
    private recomendacionService: RecomendacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecomendaciones();
    this.checkAdminStatus();
  }

  private loadRecomendaciones(): void {
    this.loading = true;
    this.error = null;
    this.recomendacionService.getRecomendaciones().subscribe({
      next: (recomendaciones) => {
        this.recomendaciones = recomendaciones;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las recomendaciones';
        this.loading = false;
        console.error('Error loading recommendations:', err);
      }
    });
  }

  private checkAdminStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
  }

  openAddRecomendacion(): void {
    this.showAddForm = true;
  }

  onSubmitRecomendacion(recomendacionData: Omit<Recomendacion, 'id'>): void {
    this.loading = true;
    this.error = null;

    this.recomendacionService.createRecomendacion(recomendacionData).subscribe({
      next: (recomendacion) => {
        this.loadRecomendaciones();
        this.showAddForm = false;
      },
      error: (err) => {
        this.error = 'Error al crear la recomendación';
        this.loading = false;
        console.error('Error creating recommendation:', err);
      }
    });
  }

  onCancelRecomendacion(): void {
    this.showAddForm = false;
  }

  onDeleteRecomendacion(id: number): void {
    this.recomendacionToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.recomendacionToDelete) {
      this.recomendacionService.deleteRecomendacion(this.recomendacionToDelete).subscribe({
        next: () => {
          this.recomendaciones = this.recomendaciones.filter(r => r.id !== this.recomendacionToDelete);
          this.showDeleteModal = false;
          this.recomendacionToDelete = null;
        },
        error: (err) => {
          this.error = 'Error al eliminar la recomendación';
          console.error('Error deleting recommendation:', err);
          this.showDeleteModal = false;
          this.recomendacionToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.recomendacionToDelete = null;
  }
}
