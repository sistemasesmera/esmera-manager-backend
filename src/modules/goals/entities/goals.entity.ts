import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MonthlyGoal {
  @PrimaryGeneratedColumn('uuid') // Cambiamos a UUID
  id: string;

  @Column({ type: 'varchar', unique: true })
  month_year: string; // Ejemplo: "2024-12"

  @Column({ type: 'int' })
  common_goal: number; // Objetivo de ventas en euros

  @Column({ type: 'int' })
  contracts_goal: number; // Objetivo de contratos (número de contratos)

  @Column({ type: 'json', nullable: true })
  holidays: string[]; // Días no laborables (array de fechas)

  @Column({ type: 'int' })
  days_in_month: number; // Número de días laborables en el mes

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
