import { Lectura } from './lectura.model'; // Importar desde lectura.model.ts
import { Foro } from './foro.model';
import { Mensaje } from './mensaje.model';
import { Evento } from './evento.model';
import { Inscripcion } from './inscripcion.model';
import { Recomendacion } from './libro.model'; // Recomendacion sigue en libro.model.ts

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
  fechaRegistro: string | Date; // Permitir ambos para flexibilidad inicial
  lecturas: Lectura[];
  foros: Foro[];
  mensajes: Mensaje[];
  eventos: Evento[]; // Eventos creados por el usuario (si aplica)
  inscripcions: Inscripcion[]; // Inscripciones a eventos
  recomendacions: Recomendacion[];


}