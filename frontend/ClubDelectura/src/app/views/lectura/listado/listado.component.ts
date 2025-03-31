import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LecturaService } from '../../../services/lectura.service';
import { Lectura } from '../../../models/lectura.model';
import { ReadingCardComponent } from '../../../components/reading-card/reading-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-lectura-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReadingCardComponent,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  lecturas: Lectura[] = [];
  loading = true;
  error = '';
  currentUserId = 1; // TODO: Get from auth service

  constructor(private lecturaService: LecturaService) {}

  ngOnInit(): void {
    this.loadLecturas();
  }

  loadLecturas(): void {
    this.loading = true;
    this.lecturaService.getLecturasByUsuario(this.currentUserId).subscribe({
      next: (lecturas) => {
        this.lecturas = lecturas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las lecturas';
        this.loading = false;
      }
    });
  }

  filterByStatus(status: string): void {
    this.loading = true;
    this.lecturaService.getLecturasByUsuarioAndStatus(this.currentUserId, status).subscribe({
      next: (lecturas) => {
        this.lecturas = lecturas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al filtrar las lecturas';
        this.loading = false;
      }
    });
  }
}
