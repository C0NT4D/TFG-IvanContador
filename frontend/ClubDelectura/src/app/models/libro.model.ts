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



