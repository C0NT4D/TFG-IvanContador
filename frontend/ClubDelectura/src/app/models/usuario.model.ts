import { Lectura } from './lectura.model';
import { Foro } from './foro.model';
import { Mensaje } from './mensaje.model';
import { Evento } from './evento.model';
import { Inscripcion } from './inscripcion.model';
import { Recomendacion } from './recomendacion.model'; // Importar desde recomendacion.model.ts

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string; // Considerar eliminarla para la comunicación normal
  rol: string;
  fechaRegistro: Date; // Tipo Date unificado
  lecturas: Lectura[];
  foros: Foro[];
  mensajes: Mensaje[];
  eventos: Evento[];
  inscripcions: Inscripcion[];
  recomendacions: Recomendacion[];

 
}