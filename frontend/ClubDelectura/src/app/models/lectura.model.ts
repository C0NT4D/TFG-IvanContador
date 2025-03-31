import { Usuario } from './usuario.model';
import { Libro } from './libro.model';

export interface Lectura {
  id: number;
  usuario: Usuario;
  libro: Libro;
  estadoLectura: string;
  fechaInicio: Date;
  fechaFin: Date | null;
} 