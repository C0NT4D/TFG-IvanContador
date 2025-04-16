import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { Evento } from '../../../models/evento.model';
import { Inscripcion } from '../../../models/inscripcion.model';

@Component({
  selector: 'app-evento-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {
  eventoForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', [Validators.required]],
      ubicacion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = 'Debes estar autenticado para crear un evento';
        return;
      }

      this.loading = true;
      this.error = '';
      
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
          this.success = true;
          this.loading = false;
          // Redirigir al listado después de un breve retraso
          setTimeout(() => {
            this.router.navigate(['/evento']);
          }, 1500);
        },
        error: (error) => {
          this.error = 'Error al crear el evento. Por favor, inténtalo de nuevo.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos correctamente.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/evento']);
  }
}
