import { CreateAlumnDto } from '../../alumn/dto/create-alumn.dto';

// El comercial completa los datos del alumno a partir del Lead
// (firstName/lastName/phone/email se pre-rellenan en el frontend desde el Lead)
export class ConvertLeadDto extends CreateAlumnDto {}
