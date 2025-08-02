// src/branch/entities/branch.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, Length, IsOptional, IsPhoneNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('uuid') // Usa UUID para id único
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(null) // Valida número telefónico internacional o local según config
  phone?: string;

  @Column()
  @IsString()
  @Length(1, 255)
  address: string;

  @Column({ nullable: true, length: 100 })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string; // Añadí ciudad que suele ser útil para sedes

  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @OneToMany(() => Contract, (contract) => contract.branch)
  contracts: Contract[];
}
