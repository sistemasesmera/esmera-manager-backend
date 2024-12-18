import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { IsEmail, Length, Matches } from 'class-validator';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Cambiado a UUID (de string)

  @Column({ unique: true })
  couponCode: string; // Código único del cupón

  @ManyToOne(() => Campaign, (campaign) => campaign.id)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign; // Relación con la campaña

  @Column()
  @IsEmail()
  email: string; // Correo del usuario

  @Column({ length: 50 })
  @Length(1, 50) // Validar longitud del nombre
  name: string; // Nombre del usuario

  @Column({ length: 50 })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international phone number.',
  }) // Validar formato del teléfono internacional
  phone: string; // Teléfono del usuario

  @Column({ default: false })
  isUsed: boolean; // Indica si el cupón fue usado

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Fecha de creación

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
