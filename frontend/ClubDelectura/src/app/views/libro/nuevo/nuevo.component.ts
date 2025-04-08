import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibroService } from '../../../services/libro.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { Libro } from '../../../models/libro.model';

@Component({
  selector: 'app-libro-nuevo',
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
  libroForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  generos = [
    'Ficción', 'No ficción', 'Misterio', 'Ciencia ficción', 'Fantasía', 
    'Romance', 'Thriller', 'Biografía', 'Historia', 'Autoayuda', 
    'Negocios', 'Ciencia', 'Tecnología', 'Arte', 'Poesía', 'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private router: Router
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      sinopsis: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  onSubmit(): void {
    if (this.libroForm.valid) {
      this.loading = true;
      this.error = '';
      
      const libroData = {
        titulo: this.libroForm.value.titulo,
        autor: this.libroForm.value.autor,
        genero: this.libroForm.value.genero,
        anioPublicacion: parseInt(this.libroForm.value.anioPublicacion),
        sinopsis: this.libroForm.value.sinopsis,
        lecturas: [],
        recomendacions: []
      };

      this.libroService.createBook(libroData).subscribe({
        next: (libro: Libro) => {
          this.success = true;
          this.loading = false;
          // Redirigir al listado después de un breve retraso
          setTimeout(() => {
            this.router.navigate(['/libros']);
          }, 1500);
        },
        error: (error: any) => {
          this.error = 'Error al crear el libro. Por favor, inténtalo de nuevo.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Por favor, completa todos los campos correctamente.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/libros']);
  }
}