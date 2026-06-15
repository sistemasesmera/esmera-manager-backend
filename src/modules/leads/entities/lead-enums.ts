export enum LeadSource {
  WEB = 'WEB',
  WEB_ONLINE = 'WEB_ONLINE',
  MANUAL = 'MANUAL',
  META_ADS = 'META_ADS',
}

export enum LeadStatus {
  NUEVO = 'NUEVO',
  CONTACTADO = 'CONTACTADO',
  EN_SEGUIMIENTO = 'EN_SEGUIMIENTO',
  MATRICULADO = 'MATRICULADO',
  DESCARTADO = 'DESCARTADO',
}

export enum LeadDiscardReason {
  NO_RESPONDE = 'NO_RESPONDE',
  SIN_PRESUPUESTO = 'SIN_PRESUPUESTO',
  NO_INTERESADO = 'NO_INTERESADO',
  YA_MATRICULADO_OTRO = 'YA_MATRICULADO_OTRO',
  DATOS_INCORRECTOS = 'DATOS_INCORRECTOS',
  OTRO = 'OTRO',
}

// Mismos valores que el @IsIn() de create-lead.dto.ts / create-lead-online.ts,
// para no romper el payload que envía la web
export enum LeadCourseCategory {
  ESTETICA = 'ESTETICA',
  PELUQUERIA = 'PELUQUERIA',
  MAQUILLAJE = 'MAQUILLAJE',
  BARBERIA = 'BARBERIA',
  UNAS = 'UÑAS',
  CEJASYPESTANAS = 'CEJASYPESTANAS',
  SIN_GESTION = 'SIN GESTION',
}
