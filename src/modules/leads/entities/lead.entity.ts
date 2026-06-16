import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../../branch/entities/branch.entity';
import { User } from '../../users/entities/user.entity';
import { Alumn } from '../../alumn/entities/alumn.entity';
import {
  LeadSource,
  LeadStatus,
  LeadDiscardReason,
  LeadCourseCategory,
} from './lead-enums';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: LeadSource, default: LeadSource.WEB })
  source: LeadSource;

  @Column({ nullable: true })
  nameCourse?: string;

  @Column({ type: 'enum', enum: LeadCourseCategory, nullable: true })
  categoryCourse?: LeadCourseCategory;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NUEVO })
  status: LeadStatus;

  @Column({ type: 'enum', enum: LeadDiscardReason, nullable: true })
  discardReason?: LeadDiscardReason;

  @Column({ type: 'text', nullable: true })
  discardReasonOther?: string;

  @ManyToOne(() => Branch, { nullable: true, eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch?: Branch;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assignedTo?: User;

  @ManyToOne(() => Alumn, { nullable: true, eager: true })
  @JoinColumn({ name: 'converted_alumn_id' })
  convertedAlumn?: Alumn;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  nextContactDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  contactedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
