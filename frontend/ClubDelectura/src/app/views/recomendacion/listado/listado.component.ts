import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecomendacionService } from '@app/services/recomendacion.service';
import { Recomendacion } from '@app/models/recomendacion.model';
import { RecommendationCardComponent } from '@app/components/recommendation-card/recommendation-card.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';
import { ConfirmModalComponent } from '@app/components/confirm-modal/confirm-modal.component';
import { RecomendacionFormComponent } from '@app/components/recomendacion-form/recomendacion-form.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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

  constructor(private recomendacionService: RecomendacionService) {}

  ngOnInit(): void {
    this.loadRecomendaciones();
  }

  loadRecomendaciones(): void {
    this.loading = true;
    this.error = null;
    
    this.recomendacionService.getRecomendaciones().subscribe({
      next: (recomendaciones) => {
        this.recomendaciones = recomendaciones;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las recomendaciones';
        this.loading = false;
      }
    });
  }

  openAddRecomendacion(): void {
    console.log('Abriendo formulario de recomendación');
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  onDeleteRecomendacion(id: number) {
    this.recomendacionToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
    if (this.recomendacionToDelete) {
      this.recomendacionService.deleteRecomendacion(this.recomendacionToDelete).subscribe({
        next: () => {
          this.recomendaciones = this.recomendaciones.filter(r => r.id !== this.recomendacionToDelete);
          this.showDeleteModal = false;
          this.recomendacionToDelete = null;
        },
        error: (error) => {
          console.error('Error al eliminar la recomendación:', error);
        }
      });
    }
  }

  onCancelDelete() {
    this.showDeleteModal = false;
    this.recomendacionToDelete = null;
  }
}
