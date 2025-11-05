// src/online-sale-course/entities/online-sale-course.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

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

  @Column({ length: 50, nullable: true })
  ref_code?: string; // lo que vino del frontend, aunque no exista el comercial

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'commercial_id' })
  commercial?: User; // relación directa con comercial

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
