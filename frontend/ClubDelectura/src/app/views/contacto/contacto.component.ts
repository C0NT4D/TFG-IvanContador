import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component'; // Asumiendo ruta
import { ErrorComponent } from '../../components/error/error.component'; // Asumiendo ruta

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.success = false;
    this.error = '';
    
    if (this.contactForm.valid) {
      this.loading = true;
      // --- Simulación de envío --- 
      console.log('Datos del formulario de contacto:', this.contactForm.value);
      // Simular una pequeña demora de red
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        this.contactForm.reset(); 
        // Opcional: resetear marcadores de touched
        // Object.keys(this.contactForm.controls).forEach(key => {
        //   this.contactForm.get(key)?.markAsUntouched();
        //   this.contactForm.get(key)?.markAsPristine();
        // });
      }, 1500); 
      // --- Fin Simulación --- 
    } else {
      console.warn('Formulario inválido');
      this.error = 'Por favor, corrige los errores en el formulario.';
      // Marcar todos los campos como touched para mostrar errores
      this.contactForm.markAllAsTouched(); 
    }
  }
} 