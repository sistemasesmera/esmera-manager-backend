import {
  IsUUID,
  IsBoolean,
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { DocumentType } from 'src/constants/document-type.enum';

enum MissingDocumentation {
  NONE = 'NINGUNO',
  PHOTOS = 'FOTOGRAFIAS',
  DOCUMENT = 'DOCUMENTO',
}

export class CreateContractDto {
  // Id del alumno
  @IsUUID()
  alumnId: string;

  // Id del curso
  @IsUUID()
  courseId: string;

  // Si tiene avalista o no
  @IsBoolean()
  hasGuarantor: boolean;

  @IsString()
  coursePrice: string;

  // Nombre del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorFirstName?: string;

  // Apellidos del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorLastName?: string;

  // Teléfono del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorPhone?: string;

  // Fecha de nacimiento del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsDateString()
  guarantorBirthDate?: string;

  // Email del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsEmail()
  guarantorEmail?: string;

  // Tipo de documento del avalista (DNI, NIE, PASAPORTE) (opcional si no tiene avalista)
  @IsOptional()
  @IsEnum(DocumentType)
  guarantorDocumentType?: DocumentType;

  // Número de documento del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorDocumentNumber?: string;

  // Dirección del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorAddress?: string;

  // Código postal del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorPostalCode?: string;

  // Población del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorPopulation?: string;

  // Provincia del avalista (opcional si no tiene avalista)
  @IsOptional()
  @IsString()
  guarantorProvince?: string;

  // Acuerdo de pago
  @IsString()
  paymentAgreement: string;

  // Observaciones
  @IsOptional()
  @IsString()
  observations?: string;

  @IsString()
  latestStudies: string;

  // Fecha del contrato
  @IsDateString()
  contractDate: string;

  // Fecha de presentación
  @IsOptional()
  @IsDateString()
  presentationDate: string;

  // Fecha de inicio del curso
  @IsOptional()
  @IsDateString()
  courseStartDate: string;

  // Fecha de finalización del curso
  @IsOptional()
  @IsDateString()
  courseEndDate: string;

  // Horario de asistencia a clases
  @IsString()
  classSchedule: string;

  // Documentación faltante (opcional)
  @IsEnum(MissingDocumentation)
  missingDocumentation: MissingDocumentation;

  @IsOptional()
  @IsString()
  additionalCourse?: string;

  // Talla de uniforme del alumno (opcional)
  @IsString()
  uniformSize?: string;
}
