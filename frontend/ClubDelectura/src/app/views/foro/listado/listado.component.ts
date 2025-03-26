import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForoService } from '../../../services/foro.service';
import { Foro } from '../../../models/foro.model';
import { ForumCardComponent } from '../../../components/forum-card/forum-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ForumCardComponent, LoadingComponent, ErrorComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  foros: Foro[] = [];
  loading = true;
  error = '';

  constructor(private foroService: ForoService) {}

  ngOnInit(): void {
    this.loadForos();
  }

  private loadForos(): void {
    this.loading = true;
    this.foroService.getForos().subscribe({
      next: (foros: Foro[]) => {
        this.foros = foros;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar los foros';
        this.loading = false;
      }
    });
  }
}
