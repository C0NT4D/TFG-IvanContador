import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LecturaService } from '../../../services/lectura.service';
import { AuthService } from '../../../services/auth.service'; // Asegurar importación
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
  currentUserId: number | null = null; // Inicializar a null

  constructor(
    private lecturaService: LecturaService,
    private authService: AuthService // Inyectar AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;
    if (this.currentUserId !== null) { // Comprobar que no sea null
      this.loadLecturas(this.currentUserId);
    } else {
      // Manejar caso de usuario no logueado o sin ID
      this.error = "No se pudo identificar al usuario. Inicia sesión para ver tus lecturas.";
      this.loading = false;
      this.lecturas = []; // Asegurar que la lista esté vacía
    }
  }

  loadLecturas(userId: number): void {
    this.loading = true;
    this.error = ''; // Limpiar error previo
    this.lecturaService.getLecturasByUsuario(userId).subscribe({
      next: (lecturas) => {
        this.lecturas = lecturas;
        this.loading = false;
      },
      error: (error: Error) => { // Tipar error
        console.error('Error loading lecturas:', error);
        this.error = 'Error al cargar tus lecturas.';
        this.loading = false;
      }
    });
  }

  // Método filterByStatus correctamente comentado
  /*
  filterByStatus(status: string): void {
    if (!this.currentUserId) return;
    this.loading = true;
    // Se necesitaría un método getLecturasByUsuarioAndStatus en el servicio
    // this.lecturaService.getLecturasByUsuarioAndStatus(this.currentUserId, status).subscribe({
    //   next: (lecturas) => {
    //     this.lecturas = lecturas;
    //     this.loading = false;
    //   },
    //   error: (error: Error) => {
    //     console.error('Error filtering lecturas:', error);
    //     this.error = 'Error al filtrar las lecturas';
    //     this.loading = false;
    //   }
    // });
  }
  */
}