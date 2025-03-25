import { Lectura } from './libro.model';
import { Foro } from './foro.model';
import { Mensaje } from './mensaje.model';
import { Evento } from './evento.model';
import { Inscripcion } from './inscripcion.model';
import { Recomendacion } from './libro.model';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
  fechaRegistro: Date;
  lecturas: Lectura[];
  foros: Foro[];
  mensajes: Mensaje[];
  eventos: Evento[];
  inscripcions: Inscripcion[];
  recomendacions: Recomendacion[];
} 