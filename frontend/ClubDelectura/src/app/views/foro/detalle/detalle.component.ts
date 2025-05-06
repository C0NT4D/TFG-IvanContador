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
          this.loadMessages(id);
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

  private loadMessages(foroId: number): void {
    this.mensajeService.getMensajesByForo(foroId).subscribe({
      next: (mensajes) => {
        console.log('Mensajes cargados:', mensajes);
        this.messages = mensajes;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar los mensajes del foro';
        this.loading = false;
        console.error("Error loading forum messages:", error);
      }
    });
  }

  sendMessage(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('ForoDetalle: Intentando enviar mensaje. Usuario actual:', currentUser); 
    console.log('ForoDetalle: Forum:', this.forum); 
    console.log('ForoDetalle: New Message Content:', this.newMessage.trim()); 

    if (!this.forum || !currentUser || !this.newMessage.trim()) {
        console.error('ForoDetalle: Validación fallida al enviar mensaje', 
          { forum: !!this.forum, user: !!currentUser, message: !!this.newMessage.trim() }); 
        if (!currentUser) {
            this.error = "No se pudo identificar al usuario para enviar el mensaje.";
        }
        if (!this.newMessage.trim()) {
             this.error = "El mensaje no puede estar vacío.";
        }
        return;
    }

    const nuevoMensaje = {
      foroId: this.forum.id,
      usuarioId: currentUser.id,
      contenido: this.newMessage.trim()
    };
    console.log('ForoDetalle: Datos del mensaje a enviar:', nuevoMensaje);

    this.mensajeService.createMensaje(nuevoMensaje).subscribe({
      next: (createdMessage: Mensaje) => {
        console.log('ForoDetalle: Mensaje creado por el servicio:', createdMessage);
        
        if (!createdMessage.usuario || !createdMessage.usuario.nombre) {
          createdMessage.usuario = {
            id: currentUser.id,
            nombre: currentUser.nombre,
            email: currentUser.email,
            contrasena: '',
            rol: currentUser.rol,
            fechaRegistro: currentUser.fechaRegistro,
            lecturas: [],
            foros: [],
            mensajes: [],
            eventos: [],
            inscripcions: [],
            recomendacions: []
          };
        }
        
        if (!createdMessage.foro || !createdMessage.foro.titulo) {
          const currentForum = this.forum as Foro;
          createdMessage.foro = currentForum;
        }
        
        try {
          this.authService.addMensajeToCurrentUser(createdMessage);
          console.log('ForoDetalle: Mensaje añadido al usuario en AuthService.');
        } catch (authError) {
          console.error('ForoDetalle: Error llamando a addMensajeToCurrentUser', authError);
        }
        
        try {
          this.messages.push(createdMessage);
          console.log('ForoDetalle: Mensaje añadido al array local this.messages.', this.messages);
        } catch (pushError) {
          console.error('ForoDetalle: Error haciendo push al array messages', pushError);
        }
        
        this.newMessage = '';
      },
      error: (error: Error) => {
        console.error("ForoDetalle: Error en la llamada a createMensaje:", error);
        this.error = 'Error al enviar el mensaje';
      }
    });
  }
}