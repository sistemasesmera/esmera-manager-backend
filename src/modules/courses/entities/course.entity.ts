import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from '../../contracts/entities/contract.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre del curso
  @Column({ length: 100 })
  name: string;

  // Precio del curso (manejado como string)
  @Column({ type: 'varchar', length: 20 })
  price: string;

  // Relación uno a muchos con contratos (Un curso puede tener muchos contratos)
  @OneToMany(() => Contract, (contract) => contract.course)
  contracts: Contract[];

  // Fecha de creación del curso
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Fecha de actualización del curso
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
