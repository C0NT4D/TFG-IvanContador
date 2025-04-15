import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Libro, Recomendacion } from '../models/libro.model';
import { Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private books: Libro[] = [
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

  constructor(private authService: AuthService) { }

  // Get all books
  getBooks(): Observable<Libro[]> {
    return of(this.books);
  }

  // Get a book by ID
  getBook(id: number): Observable<Libro | undefined> {
    return of(this.books.find(book => book.id === id));
  }

  // Get books by genre
  getBooksByGenre(genre: string): Observable<Libro[]> {
    return of(this.books.filter(book => book.genero === genre));
  }

  // Get unique genres
  getGenres(): Observable<string[]> {
    return of([...new Set(this.books.map(book => book.genero))]);
  }

  // Create a new book
  createBook(book: Omit<Libro, 'id'>): Observable<Libro> {
    const newBook = {
      ...book,
      id: this.books.length + 1
    };
    this.books.push(newBook);
    return of(newBook);
  }

  // Update an existing book
  updateBook(id: number, book: Partial<Libro>): Observable<Libro | undefined> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...book };
      return of(this.books[index]);
    }
    return of(undefined);
  }

  // Delete a book
  deleteBook(id: number): Observable<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Methods for readings - MOVED TO LecturaService
  /*
  getReadings(bookId: number): Observable<Lectura[]> {
    const book = this.books.find(b => b.id === bookId);
    return of(book ? book.lecturas : []);
  }

  // Add a reading to a book
  addReading(bookId: number, reading: Lectura): Observable<Lectura> {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      book.lecturas.push(reading);
      return of(reading);
    }
    throw new Error('Book not found');
  }
  */

  // Methods for recommendations
  getRecommendations(bookId: number): Observable<Recomendacion[]> {
    const book = this.books.find(b => b.id === bookId);
    return of(book ? book.recomendacions : []);
  }

  // Add a recommendation to a book
  addRecommendation(bookId: number, recommendation: Recomendacion): Observable<Recomendacion> {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      book.recomendacions.push(recommendation);
      return of(recommendation);
    }
    throw new Error('Book not found');
  }
} 