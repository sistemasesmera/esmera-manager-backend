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
  IsEnum,
  IsNumber,
} from 'class-validator';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

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

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  paymentReference?: string; // ID del pago externo (Stripe, PayPal, etc.)

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
