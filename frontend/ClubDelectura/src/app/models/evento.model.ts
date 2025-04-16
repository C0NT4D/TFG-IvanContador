import { Usuario } from './usuario.model';
// Importar Inscripcion desde su archivo
import { Inscripcion } from './inscripcion.model';

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  ubicacion: string;
  organizador: Usuario;
  // Usar la Inscripcion importada
  inscripcions?: Inscripcion[];
}

// Eliminar la definición local de Inscripcion
/*
export interface Inscripcion {
  // ... properties ...
}
*/ 