import { Usuario } from './usuario.model';

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

export interface Lectura {
  id: number;
  usuario: Usuario;
  libro: Libro;
  estadoLectura: string;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Recomendacion {
  id: number;
  usuario: Usuario;
  libro: Libro;
  comentario: string;
  fecha: Date;
} 