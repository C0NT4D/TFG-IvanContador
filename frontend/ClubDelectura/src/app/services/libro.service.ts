import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Libro } from '../models/libro.model';
import { Recomendacion } from '../models/recomendacion.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/libros`).pipe(
      catchError(this.handleError)
    );
  }

  getBook(id: number): Observable<Libro | undefined> {
    return this.http.get<Libro>(`${this.apiUrl}/libro/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getBooksByGenre(genre: string): Observable<Libro[]> {
    return this.getBooks().pipe(
      map(books => books.filter(book => book.genero === genre)),
      catchError(this.handleError)
    );
  }

  getGenres(): Observable<string[]> {
    return this.getBooks().pipe(
      map(books => [...new Set(books.map(book => book.genero))]),
      catchError(this.handleError)
    );
  }

  createBook(book: Omit<Libro, 'id'>): Observable<Libro> {
    return this.http.post<Libro>(`${this.apiUrl}/libro`, book).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, book: Partial<Libro>): Observable<Libro | undefined> {
    return this.http.put<Libro>(`${this.apiUrl}/libro/${id}`, book).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/libro/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getRecommendations(bookId: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.apiUrl}/libro/${bookId}/recomendaciones`).pipe(
      catchError(error => {
        console.warn('El endpoint de recomendaciones por libro puede no existir:', error);
        return of([]);
      })
    );
  }

  addRecommendation(bookId: number, recommendation: Omit<Recomendacion, 'id'>): Observable<Recomendacion> {
    return this.http.post<Recomendacion>(`${this.apiUrl}/recomendacion`, {
      ...recommendation,
      libroId: bookId
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 