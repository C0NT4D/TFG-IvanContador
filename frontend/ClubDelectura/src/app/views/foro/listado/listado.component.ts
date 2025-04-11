import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForumCardComponent } from '../../../components/forum-card/forum-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { ForoService } from '../../../services/foro.service';
import { AuthService } from '../../../services/auth.service';
import { Foro } from '../../../models/foro.model';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ForumCardComponent,
    LoadingComponent,
    ErrorComponent,
    ConfirmModalComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  forums: Foro[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;
  showAddForm = false;
  showDeleteModal = false;
  foroToDelete: number | null = null;
  foroForm: FormGroup;

  constructor(
    private foroService: ForoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.foroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadForums();
    this.checkAdminStatus();
  }

  private loadForums(): void {
    this.loading = true;
    this.error = null;
    this.foroService.getForos().subscribe({
      next: (forums: Foro[]) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar los foros';
        this.loading = false;
        console.error('Error loading forums:', err);
      }
    });
  }

  private checkAdminStatus(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.rol === 'admin';
  }

  openAddForum(): void {
    this.showAddForm = true;
  }

  onCancel(): void {
    this.showAddForm = false;
    this.foroForm.reset();
  }

  onSubmit(): void {
    if (this.foroForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = 'Debes estar autenticado para crear un foro';
        return;
      }

      const foroData = {
        titulo: this.foroForm.get('titulo')?.value,
        descripcion: this.foroForm.get('descripcion')?.value,
        admin: currentUser,
        mensajes: []
      };

      this.foroService.createForo(foroData).subscribe({
        next: (foro) => {
          this.loadForums();
          this.showAddForm = false;
          this.foroForm.reset();
        },
        error: (err) => {
          this.error = 'Error al crear el foro';
          console.error('Error creating forum:', err);
        }
      });
    }
  }

  onDeleteForum(forumId: number): void {
    this.foroToDelete = forumId;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.foroToDelete) {
      this.foroService.deleteForo(this.foroToDelete).subscribe({
        next: () => {
          this.forums = this.forums.filter(f => f.id !== this.foroToDelete);
          this.showDeleteModal = false;
          this.foroToDelete = null;
        },
        error: (err: Error) => {
          this.error = 'Error al eliminar el foro';
          console.error('Error deleting forum:', err);
          this.showDeleteModal = false;
          this.foroToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.foroToDelete = null;
  }
}
