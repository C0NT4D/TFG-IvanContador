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
  forum: Foro | undefined;
  messages: Mensaje[] = [];
  newMessage = '';
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
    this.loadForum(id);
  }

  private loadForum(id: number): void {
    this.loading = true;
    this.foroService.getForo(id).subscribe({
      next: (forum) => {
        if (forum) {
          this.forum = forum;
          this.messages = forum.mensajes;
          this.loading = false;
        } else {
          this.error = 'Forum not found';
          this.loading = false;
        }
      },
      error: (error: Error) => {
        this.error = 'Error loading forum';
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.forum || !this.newMessage.trim()) return;

    const message: Omit<Mensaje, 'id' | 'fechaEnvio'> = {
      foro: this.forum,
      usuario: {
        id: this.currentUserId,
        nombre: 'Current User', // TODO: Get from auth service
        email: 'user@example.com',
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
      contenido: this.newMessage.trim()
    };

    this.mensajeService.createMensaje(message).subscribe({
      next: (createdMessage) => {
        this.messages.push(createdMessage);
        this.newMessage = '';
      },
      error: (error: Error) => {
        this.error = 'Error sending message';
      }
    });
  }
}