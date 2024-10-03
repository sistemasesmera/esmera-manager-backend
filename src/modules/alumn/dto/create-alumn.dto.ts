// src/alumn/dto/create-alumn.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  Length,
  IsDateString,
} from 'class-validator';
import { DocumentType } from 'src/constants/document-type.enum';

export class CreateAlumnDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @Length(0, 15)
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  population: string;

  @IsString()
  @IsNotEmpty()
  province: string;
}
