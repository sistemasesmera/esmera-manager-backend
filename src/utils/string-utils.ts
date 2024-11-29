/**
 * Transforma un nombre o apellido a formato capitalizado
 * (Primera letra en mayúscula y el resto en minúscula).
 *
 * @param str - La cadena de texto a formatear.
 * @returns La cadena formateada con la primera letra en mayúscula y el resto en minúscula.
 */
export function formatText(str: string): string {
  if (!str.trim()) return str; // Si es una cadena vacía o solo espacios, no hace nada.

  return str
    .split(' ') // Si hay más de una palabra (nombre compuesto), las separa.
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza la primera letra de cada palabra.
    .join(' '); // Vuelve a unir las palabras.
}
