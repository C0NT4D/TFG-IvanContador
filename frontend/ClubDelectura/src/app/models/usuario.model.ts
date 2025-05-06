import { Lectura } from './lectura.model';
import { Foro } from './foro.model';
import { Mensaje } from './mensaje.model';
import { Evento } from './evento.model';
import { Inscripcion } from './inscripcion.model';
import { Recomendacion } from './recomendacion.model'; 

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