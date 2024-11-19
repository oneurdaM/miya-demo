
import { format, toZonedTime } from 'date-fns-tz';
import { format as formatDateFns } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: Date | string): string {
  // Format date like Mayo 5, 2021 12:00 AM

  return new Intl.DateTimeFormat('es-US',{
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date))
}


export const formatDateCabos = (date: string) => {
  const timeZone = 'America/Los_Angeles'; // Zona horaria para Los Cabos
  const utcDate = new Date(date); // Convierte la cadena a objeto Date
  const zonedDate = toZonedTime(utcDate, timeZone); // Convierte a la zona horaria de Los Cabos

  // Formatear la fecha
  const formattedDate = formatDateFns(zonedDate, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es });
  


  return {
    label: formattedDate,
    value: date
  };
};


export const getFormattedDateInLosCabos = () => {
  const timeZone = 'America/Los_Angeles'; // Zona horaria de Los Cabos
  const utcDate = new Date(); // Fecha y hora actual en UTC
  const zonedDate = toZonedTime(utcDate, timeZone); // Convertir a la zona horaria de Los Cabos

  // Formato deseado: YYYY-MM-DD
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
};


// Format Only Time
export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('es-US',{
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date))
}

export const jobPosition = [
  {label: 'Guard',value: 'GUARD', id:1},
  {label: 'Parking enforcer',value: 'PARKING_ENFORCER', id:2},
  {label: 'Guard Special Security Unit',value: 'GUARD_SSU', id:3},
  {label: 'Security Inspector at the PIPEM and Access Controls',value: 'INSPECTOR_PIPEM_AC', id:4},
  {label: 'Security Inspector at HBS',value: 'INSPECTOR_HBS', id:5},
  {label: 'Inspector en el Security Operations Center',value: 'INSPECTOR_SOC', id:6},
  {label: 'Facilitation Assistant',value: 'FACILITATION_ASSISTANT', id:7},
  {label: 'Supervisor',value: 'SUPERVISOR', id:8},
  {label: 'Head of Service',value: 'HEAD_OF_SERVICE', id:9},
  {label: 'Canine Binomial',value: 'CANINE_BINOMIAL', id:10},
]

export const mesesDelAño = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 }
];


export const attendence =[
  { label: 'En sitio', value: 'ON_SITE' },
  { label: 'Fuera de sitio', value: 'OFF_SITE' }
]