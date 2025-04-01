import { Usuario } from './usuario.model';
import { Libro } from './libro.model';

export interface Recomendacion {
  id: number;
  usuario: Usuario;
  libro: Libro;
  comentario: string;
  fecha: Date;
} 