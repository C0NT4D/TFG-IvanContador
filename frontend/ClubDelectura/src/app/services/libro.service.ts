import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Libro, Lectura, Recomendacion, Usuario } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private libros: Libro[] = [
    {
      id: 1,
      titulo: 'El Quijote',
      autor: 'Miguel de Cervantes',
      genero: 'Clásico',
      anioPublicacion: 1605,
      sinopsis: 'La historia de un hidalgo que enloquece leyendo libros de caballerías...',
      lecturas: [],
      recomendacions: []
    },
    {
      id: 2,
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      genero: 'Realismo mágico',
      anioPublicacion: 1967,
      sinopsis: 'La historia de la familia Buendía a lo largo de siete generaciones...',
      lecturas: [],
      recomendacions: []
    },
    {
      id: 3,
      titulo: '1984',
      autor: 'George Orwell',
      genero: 'Ciencia ficción',
      anioPublicacion: 1949,
      sinopsis: 'Una distopía que describe una sociedad totalitaria...',
      lecturas: [],
      recomendacions: []
    }
  ];

  constructor() { }

  // Obtener todos los libros
  getLibros(): Observable<Libro[]> {
    return of(this.libros);
  }

  // Obtener un libro por ID
  getLibro(id: number): Observable<Libro | undefined> {
    return of(this.libros.find(libro => libro.id === id));
  }

  // Obtener libros por género
  getLibrosPorGenero(genero: string): Observable<Libro[]> {
    return of(this.libros.filter(libro => libro.genero === genero));
  }

  // Obtener géneros únicos
  getGeneros(): Observable<string[]> {
    const generos = [...new Set(this.libros.map(libro => libro.genero))];
    return of(generos);
  }

  // Métodos para lecturas
  getLecturas(libroId: number): Observable<Lectura[]> {
    const libro = this.libros.find(l => l.id === libroId);
    return of(libro ? libro.lecturas : []);
  }

  // Métodos para recomendaciones
  getRecomendaciones(libroId: number): Observable<Recomendacion[]> {
    const libro = this.libros.find(l => l.id === libroId);
    return of(libro ? libro.recomendacions : []);
  }
} 