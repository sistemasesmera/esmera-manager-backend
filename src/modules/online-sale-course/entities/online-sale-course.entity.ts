// src/online-sale-course/entities/online-sale-course.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';

@Entity()
export class OnlineSaleCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre del comprador

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string; // Apellido del comprador

  @Column()
  @IsString()
  @IsNotEmpty()
  nameCourse: string; // Nombre del curso comprado

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  amount: number;
  @Column()
  @IsString()
  @IsNotEmpty()
  practiceMode: string; // 'con-practicas' | 'sin-practicas'

  @Column()
  @IsString()
  @IsNotEmpty()
  modality: string; // 'Online' | 'Presencial'

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  paymentReference?: string; // ID del pago externo (Stripe)

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
