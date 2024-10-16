import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Alumn } from '../../alumn/entities/alumn.entity';
import { IsEnum } from 'class-validator';
import { DocumentType } from '../../../constants/document-type.enum';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacion muchos a uno con el Usuario (Comercial o Comercial Plus)
  @ManyToOne(() => User, (user) => user.contracts, {
    nullable: false,
  })
  user: User;

  // Relación muchos a uno con Alumn
  @ManyToOne(() => Alumn, (alumn) => alumn.contracts, {
    nullable: false,
  })
  alumn: Alumn; // Un contrato pertenece a un solo alumno

  // Relación muchos a uno con Course (Un contrato solo puede tener un curso)
  @ManyToOne(() => Course, (course) => course.contracts, {
    nullable: false, // Un contrato necesita siempre un curso asociado
  })
  course: Course;

  @Column()
  coursePrice: string;

  @Column()
  name: string;

  // Campo que indica si tiene avalista o no
  @Column({ type: 'boolean', default: false })
  hasGuarantor: boolean;

  // Nombre del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorFirstName: string;

  // Apellidos del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorLastName: string;

  // Teléfono del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorPhone: string;

  // Fecha de nacimiento del avalista (nulo si no tiene avalista)
  @Column({ type: 'date', nullable: true })
  guarantorBirthDate: Date;

  // Email del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorEmail: string;

  // Tipo de documento del avalista (DNI, NIE, PASAPORTE) (nulo si no tiene avalista)
  @Column({
    type: 'enum',
    enum: DocumentType,
    nullable: true,
  })
  @IsEnum(DocumentType)
  guarantorDocumentType: string;

  // Número de documento del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorDocumentNumber: string;

  // Dirección del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorAddress: string;

  // Código postal del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorPostalCode: string;

  // Población del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorPopulation: string;

  // Provincia del avalista (nulo si no tiene avalista)
  @Column({ nullable: true })
  guarantorProvince: string;

  // Nuevo campo: Acuerdo de pago
  @Column({ type: 'text' })
  paymentAgreement: string;

  // Nuevo campo: Observaciones (opcional)
  @Column({ type: 'text', nullable: true })
  observations?: string;

  // Nuevo campo: Fecha del contrato
  @Column({ type: 'date' })
  contractDate: Date;

  // Nuevo campo: Fecha de presentación
  @Column({ type: 'date' })
  presentationDate: Date;

  // Nuevo campo: Fecha de inicio del curso
  @Column({ type: 'date' })
  courseStartDate: Date;

  // Nuevo campo: Fecha de finalización del curso
  @Column({ type: 'date' })
  courseEndDate: Date;

  // Nuevo campo: Horario de clases
  @Column({ type: 'text' })
  classSchedule: string;

  // Nuevo campo: Documentación faltante
  @Column({
    type: 'enum',
    enum: ['NINGUNO', 'FOTOGRAFIAS', 'DOCUMENTO'],
    default: 'NINGUNO',
  })
  missingDocumentation: string;

  // Nuevo campo: Talla del uniforme (opcional)
  @Column({ type: 'text' })
  uniformSize: string;

  // Nuevo campo: Ultimos estudios realizados
  @Column({ type: 'text' })
  latestStudies: string;

  // Nuevo campo: Ultimos estudios realizados
  @Column({ type: 'text', nullable: true })
  additionalCourse: string;

  // Fecha de creacion del contrato (Para fines de base de datos)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Fecha de actualizacion del contrato (Para fines de base de datos)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
