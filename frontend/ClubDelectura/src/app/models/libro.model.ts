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
  libro: Libro;
  usuario: Usuario;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
  valoracion: number;
  comentario: string;
}

export interface Recomendacion {
  id: number;
  libro: Libro;
  usuario: Usuario;
  fecha: Date;
  comentario: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  // Otros campos del usuario que necesitemos
} 