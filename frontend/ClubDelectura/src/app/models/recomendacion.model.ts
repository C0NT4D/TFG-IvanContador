import { Usuario } from './usuario.model';
import { Libro } from './libro.model';

export interface Recomendacion {
  id: number;
  usuario: {
    id: number;
    nombre: string;
  };
  libro: {
    id: number;
    titulo: string;
  };
  comentario: string;
  fecha: Date;
} 