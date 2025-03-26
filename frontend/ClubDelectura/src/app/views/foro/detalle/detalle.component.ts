import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { MensajeService } from '../../../services/mensaje.service';
import { Foro } from '../../../models/foro.model';
import { Mensaje } from '../../../models/mensaje.model';
import { ForumMessageComponent } from '../../../components/forum-message/forum-message.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ForumMessageComponent, LoadingComponent, ErrorComponent],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  foro: Foro | undefined;
  mensajes: Mensaje[] = [];
  nuevoMensaje = '';
  loading = true;
  error = '';
  currentUserId = 1; // TODO: Get from auth service

  constructor(
    private route: ActivatedRoute,
    private foroService: ForoService,
    private mensajeService: MensajeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadForo(id);
  }

  private loadForo(id: number): void {
    this.loading = true;
    this.foroService.getForo(id).subscribe({
      next: (foro) => {
        if (foro) {
          this.foro = foro;
          this.mensajes = foro.mensajes;
          this.loading = false;
        } else {
          this.error = 'Foro no encontrado';
          this.loading = false;
        }
      },
      error: (error: Error) => {
        this.error = 'Error al cargar el foro';
        this.loading = false;
      }
    });
  }

  enviarMensaje(): void {
    if (!this.foro || !this.nuevoMensaje.trim()) return;

    const mensaje: Omit<Mensaje, 'id' | 'fechaEnvio'> = {
      foro: this.foro,
      usuario: {
        id: this.currentUserId,
        nombre: 'Usuario Actual', // TODO: Get from auth service
        email: 'usuario@example.com',
        contrasena: '',
        rol: 'ROLE_USER',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      },
      contenido: this.nuevoMensaje.trim()
    };

    this.mensajeService.createMensaje(mensaje).subscribe({
      next: (mensajeCreado) => {
        this.mensajes.push(mensajeCreado);
        this.nuevoMensaje = '';
      },
      error: (error: Error) => {
        this.error = 'Error al enviar el mensaje';
      }
    });
  }
}