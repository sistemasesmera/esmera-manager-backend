import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsEmail, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserRoles } from '../../../constants/Roles.enum';
import { Contract } from '../../contracts/entities/contract.entity';
import { Branch } from '../../branch/entities/branch.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50, nullable: true, unique: true })
  username?: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.COMMERCIAL })
  @IsEnum(UserRoles)
  @Exclude()
  role: UserRoles;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts: Contract[];

  @ManyToOne(() => Branch, (branch) => branch.users, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
