// src/alumn/entities/alumn.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsDate,
  Length,
  IsPostalCode,
} from 'class-validator';
import { DocumentType } from 'src/constants/document-type.enum';
import { Contract } from 'src/modules/contracts/entities/contract.entity';

@Entity()
export class Alumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @Column()
  @IsString()
  @Length(0, 15)
  phone: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsPostalCode('ES')
  @IsNotEmpty()
  postalCode: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  population: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  province: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relación uno a muchos con contratos
  @OneToMany(() => Contract, (contract) => contract.alumn)
  contracts: Contract[]; // Un alumno puede tener varios contratos
}
