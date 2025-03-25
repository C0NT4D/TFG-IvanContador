import { Evento } from './evento.model';
import { Usuario } from './usuario.model';

export interface Inscripcion {
  id: number;
  evento: Evento;
  usuario: Usuario;
  fechaInscripcion: Date;
} 