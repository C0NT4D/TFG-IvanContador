import { Usuario } from './usuario.model';
import { Inscripcion } from './inscripcion.model';

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  ubicacion: string;
  organizador: Usuario;
  inscripcions: Inscripcion[];
} 