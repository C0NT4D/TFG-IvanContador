import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { MensajeService } from '../../../services/mensaje.service';
import { AuthService } from '../../../services/auth.service';
import { Foro } from '../../../models/foro.model';
import { Mensaje } from '../../../models/mensaje.model';
import { Usuario } from '../../../models/usuario.model';
import { ForumMessageComponent } from '../../../components/forum-message/forum-message.component';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ForumMessageComponent
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  forum: Foro | undefined;
  messages: Mensaje[] = [];
  newMessage = '';
  loading = true;
  error = '';
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private foroService: ForoService,
    private mensajeService: MensajeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;
    
    this.route.params.subscribe(params => {
        const id = Number(params['id']);
        if (id) {
           this.loadForum(id);
        } else {
            this.error = 'ID de foro no válido.';
            this.loading = false;
        }
    });
  }

  private loadForum(id: number): void {
    this.loading = true;
    this.error = '';
    this.foroService.getForo(id).subscribe({
      next: (forum) => {
        if (forum) {
          this.forum = forum;
          this.messages = forum.mensajes || [];
          this.loading = false;
        } else {
          this.error = 'Foro no encontrado';
          this.loading = false;
        }
      },
      error: (error: Error) => {
        this.error = 'Error al cargar el foro';
        this.loading = false;
        console.error("Error loading forum details:", error);
      }
    });
  }

  sendMessage(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!this.forum || !currentUser || !this.newMessage.trim()) {
        if (!currentUser) {
            this.error = "No se pudo identificar al usuario para enviar el mensaje.";
        }
        return;
    }

    const nuevoMensaje: Omit<Mensaje, 'id' | 'fechaEnvio'> = {
      contenido: this.newMessage.trim(),
      foro: this.forum,
      usuario: currentUser
    };

    this.mensajeService.createMensaje(nuevoMensaje).subscribe({
      next: (createdMessage: Mensaje) => {
        this.messages.push(createdMessage);
        this.newMessage = '';
      },
      error: (error: Error) => {
        this.error = 'Error al enviar el mensaje';
        console.error("Error sending message:", error);
      }
    });
  }
}