// src/coupons/entities/campaign.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Coupon } from './coupons.entity';
import { IsDate, Length } from 'class-validator';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  campaignCode: string;

  @Column({ length: 50 })
  @Length(1, 50) // Validar longitud del nombre
  courseName: string; // Como string, puede ser "Estetica", "Barberia", etc.

  @Column({ type: 'integer' }) // Cambia el tipo SQL a integer
  discountAmount: number; // Number. Cantidad de dinero que se descuenta.

  @Column({ type: 'integer' }) // Cambia el tipo SQL a integer
  totalCoupons: number; // Total de cupones disponibles

  @Column({ type: 'integer' }) // Cambia el tipo SQL a integer
  availableCoupons: number; // Cupones disponibles (restantes)

  @Column()
  @IsDate()
  expirationDate: Date; // Expiration date campaigns

  @Column()
  status: string; // 'active', 'inactive'

  @OneToMany(() => Coupon, (coupon) => coupon.campaign)
  coupons: Coupon[];
}
