import { Usuario } from './usuario.model';
import { Mensaje } from './mensaje.model';

export interface Foro {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: Date;
  admin: Usuario;
  mensajes: Mensaje[];
} 