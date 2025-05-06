import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

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
      console.log('Datos del formulario de contacto:', this.contactForm.value);
      
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        this.contactForm.reset(); 
     
      }, 1500); 
    } else {
      console.warn('Formulario inválido');
      this.error = 'Por favor, corrige los errores en el formulario.';
      this.contactForm.markAllAsTouched(); 
    }
  }
} 