import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LecturaService } from '../../../services/lectura.service';
import { AuthService } from '../../../services/auth.service';
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
  currentUserId: number | null = null;

  constructor(
    private lecturaService: LecturaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;
    if (this.currentUserId !== null) {
      this.loadLecturas(this.currentUserId);
    } else {
      this.error = "No se pudo identificar al usuario. Inicia sesión para ver tus lecturas.";
      this.loading = false;
      this.lecturas = [];
    }
  }

  loadLecturas(userId: number): void {
    this.loading = true;
    this.error = '';
    this.lecturaService.getLecturasByUsuario(userId).subscribe({
      next: (lecturas) => {
        this.lecturas = lecturas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading lecturas:', error);
        if (error.status === 400) {
          this.error = 'No se pudo cargar la lista de lecturas. Por favor, intenta iniciar sesión nuevamente.';
        } else if (error.status === 404) {
          this.error = 'No se encontraron lecturas para este usuario.';
        } else {
          this.error = 'Error al cargar tus lecturas. Por favor, intenta nuevamente más tarde.';
        }
        this.loading = false;
        this.lecturas = [];
      }
    });
  }

  
  
}