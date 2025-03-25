import { Foro } from './foro.model';
import { Usuario } from './usuario.model';

export interface Mensaje {
  id: number;
  foro: Foro;
  usuario: Usuario;
  contenido: string;
  fechaEnvio: Date;
} 