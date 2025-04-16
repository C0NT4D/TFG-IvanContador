import { Usuario } from './usuario.model';
import { Evento } from './evento.model';

export interface Inscripcion {
  id: number;
  usuario: Usuario;
  evento: Evento;
  fechaInscripcion: Date;
} 