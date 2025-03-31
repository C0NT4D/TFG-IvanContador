import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LecturaService } from '../../../services/lectura.service';
import { Lectura } from '../../../models/lectura.model';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-detalle',
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
  lectura: Lectura | null = null;
  loading = true;
  error: string | null = null;
  currentUserId = 1; // TODO: Obtener del servicio de autenticación

  constructor(private route: ActivatedRoute, private lecturaService: LecturaService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLectura(id);
  }

  private loadLectura(id: number): void {
    this.loading = true;
    this.error = null;
    this.lecturaService.getLectura(id).subscribe({
      next: (lectura: Lectura) => {
        this.lectura = lectura;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar la lectura';
        this.loading = false;
      }
    });
  }

  updateStatus(): void {
    if (!this.lectura) return;

    const updatedLectura: Lectura = {
      ...this.lectura,
      fechaFin: this.lectura.estadoLectura === 'COMPLETED' ? new Date() : null
    };

    this.lecturaService.updateLectura(this.lectura.id, updatedLectura).subscribe({
      next: (lectura: Lectura) => {
        this.lectura = lectura;
      },
      error: (error: Error) => {
        this.error = 'Error al actualizar el estado de la lectura';
      }
    });
  }
}
