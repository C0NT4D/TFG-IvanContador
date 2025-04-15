import { Usuario } from './usuario.model';
import { Libro } from './libro.model';

export interface Lectura {
  id: number;
  usuario: Usuario;
  libro: Libro;
  estadoLectura: 'PENDING' | 'EN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  fechaInicio: Date;
  fechaFin?: Date | null;
} 