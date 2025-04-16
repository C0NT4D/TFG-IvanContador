import { Usuario } from './usuario.model';
import { Lectura } from './lectura.model';
import { Recomendacion } from './recomendacion.model';

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

// Eliminar CUALQUIER definición local de Lectura o Recomendacion aquí

// La definición de Recomendacion debe estar en recomendacion.model.ts
/*
export interface Recomendacion { ... }
*/ 