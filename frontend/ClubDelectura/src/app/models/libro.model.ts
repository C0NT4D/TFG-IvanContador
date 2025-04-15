import { Usuario } from './usuario.model';
import { Lectura } from './lectura.model';

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  anioPublicacion: number;
  sinopsis: string;
  lecturas: Lectura[];
  recomendacions: Recomendacion[];
}

export interface Recomendacion {
  id: number;
  usuario: Usuario;
  libro: Libro;
  comentario: string;
  fecha: Date;
} 