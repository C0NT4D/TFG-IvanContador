import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recomendacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recomendacion-form.component.html',
  styleUrls: ['./recomendacion-form.component.css']
})
export class RecomendacionFormComponent {
  @Output() closeForm = new EventEmitter<void>();
  
  recomendacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    console.log('Constructor del formulario llamado');
    this.recomendacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      razonRecomendacion: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.recomendacionForm.valid) {
      console.log('Formulario enviado:', this.recomendacionForm.value);
      // Aquí irá la lógica para enviar la recomendación
      this.closeForm.emit();
    }
  }

  onCancel() {
    this.closeForm.emit();
  }
} 