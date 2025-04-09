import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForoService } from '../../../services/foro.service';
import { Foro } from '../../../models/foro.model';
import { ForumCardComponent } from '../../../components/forum-card/forum-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  error = '';
  showDeleteModal = false;
  forumToDelete: number | null = null;
  isAdmin = false;

  constructor(
    private foroService: ForoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadForums();
    this.checkAdminStatus();
  }

  private loadForums(): void {
    this.loading = true;
    this.foroService.getForos().subscribe({
      next: (forums: Foro[]) => {
        this.forums = forums;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error loading forums';
        this.loading = false;
      }
    });
  }

  private checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
  }

  onDeleteForum(id: number): void {
    this.forumToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.forumToDelete) {
      this.loading = true;
      this.foroService.deleteForo(this.forumToDelete).subscribe({
        next: () => {
          this.forums = this.forums.filter(forum => forum.id !== this.forumToDelete);
          this.loading = false;
          this.showDeleteModal = false;
          this.forumToDelete = null;
        },
        error: (error: Error) => {
          this.error = 'Error deleting forum';
          this.loading = false;
          this.showDeleteModal = false;
          this.forumToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.forumToDelete = null;
  }
}
