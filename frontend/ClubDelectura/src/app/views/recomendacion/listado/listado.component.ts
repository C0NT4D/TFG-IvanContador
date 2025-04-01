import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecomendacionService } from '@app/services/recomendacion.service';
import { Recomendacion } from '@app/models/recomendacion.model';
import { RecommendationCardComponent } from '@app/components/recommendation-card/recommendation-card.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RecommendationCardComponent,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  recomendaciones: Recomendacion[] = [];
  loading = true;
  error = false;

  constructor(private recomendacionService: RecomendacionService) {}

  ngOnInit(): void {
    this.loadRecomendaciones();
  }

  loadRecomendaciones(): void {
    this.loading = true;
    this.error = false;
    
    this.recomendacionService.getRecomendaciones().subscribe({
      next: (recomendaciones) => {
        this.recomendaciones = recomendaciones;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  openAddRecomendacion(): void {
    // Por ahora solo un console.log, luego implementaremos el diálogo
    console.log('Abrir diálogo para añadir recomendación');
  }

  deleteRecomendacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta recomendación?')) {
      this.recomendacionService.deleteRecomendacion(id).subscribe({
        next: () => {
          this.recomendaciones = this.recomendaciones.filter(r => r.id !== id);
        },
        error: () => {
          // Por ahora solo un console.error, luego implementaremos un mensaje de error
          console.error('Error al eliminar la recomendación');
        }
      });
    }
  }
}
