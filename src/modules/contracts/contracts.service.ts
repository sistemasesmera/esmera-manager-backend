import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { Contract } from './entities/contract.entity';
import { User } from '../users/entities/user.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Course } from '../courses/entities/course.entity';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract) // Repositorio para la entidad Contract
    private contractRepository: Repository<Contract>,
    @InjectRepository(User) // Repositorio para la entidad User
    private userRepository: Repository<User>,
    @InjectRepository(Alumn) // Repositorio para la entidad Alumn
    private alumnRepository: Repository<Alumn>,
    @InjectRepository(Course) // Repositorio para la entidad Course
    private courseRepository: Repository<Course>,
  ) {}

  async create(createContractDto: CreateContractDto, user: AuthenticatedUser) {
    console.log('aditional course', createContractDto.additionalCourse);
    // Validación de usuario (comercial o comercial-plus)
    const userFound = await this.userRepository.findOneBy({
      id: user.id,
    });
    if (!userFound) {
      throw new NotFoundException(`User with id ${user.id} not found`);
    }

    // Validación de alumno
    const alumn = await this.alumnRepository.findOneBy({
      id: createContractDto.alumnId,
    });
    if (!alumn) {
      throw new NotFoundException(
        `Alumn with id ${createContractDto.alumnId} not found`,
      );
    }

    // Validación de curso
    const course = await this.courseRepository.findOneBy({
      id: createContractDto.courseId,
    });
    if (!course) {
      throw new NotFoundException(
        `Course with id ${createContractDto.courseId} not found`,
      );
    }
    const uniqueId = uuidv4();
    // Crear una nueva instancia de contrato
    const contract = this.contractRepository.create({
      user, // Relación con el comercial
      alumn, // Relación con el alumno
      course, // Relación con el curso
      coursePrice: createContractDto.coursePrice, // Precio del curso
      hasGuarantor: createContractDto.hasGuarantor, // Booleano si tiene o no avalista.
      guarantorFirstName: createContractDto.guarantorFirstName, // Nombre Avalista
      guarantorLastName: createContractDto.guarantorLastName, // Apellidos Avalista
      guarantorPhone: createContractDto.guarantorPhone, // Telefono Avalista
      guarantorBirthDate: createContractDto.guarantorBirthDate // Nombre Avalista
        ? new Date(createContractDto.guarantorBirthDate) // Fecha nacimiento Avalista
        : null,
      guarantorEmail: createContractDto.guarantorEmail, // Correo Avalista
      guarantorDocumentType: createContractDto.guarantorDocumentType, // Tipo de documento Avalista
      guarantorDocumentNumber: createContractDto.guarantorDocumentNumber, // Numero documento Avalista
      guarantorAddress: createContractDto.guarantorAddress, // Direccion Avalista
      guarantorPostalCode: createContractDto.guarantorPostalCode, // Codigo Postal Avalista
      guarantorPopulation: createContractDto.guarantorPopulation, // Ciudad Avalista
      guarantorProvince: createContractDto.guarantorProvince, // Provincia Avalista
      paymentAgreement: createContractDto.paymentAgreement, //Acuerdo de pago
      observations: createContractDto.observations, // Observaciones
      contractDate: new Date(createContractDto.contractDate), // Fecha contrato
      presentationDate: new Date(createContractDto.presentationDate), // Fecha presentacion
      courseStartDate: new Date(createContractDto.courseStartDate), // Fecha inicio
      courseEndDate: new Date(createContractDto.courseEndDate), // Fecha finalizacion
      classSchedule: createContractDto.classSchedule, // Horario de clases
      missingDocumentation: createContractDto.missingDocumentation, // Documentacion faltante
      uniformSize: createContractDto.uniformSize, //Talla uniforme
      latestStudies: createContractDto.latestStudies, // Ultimis estudios realizados
      additionalCourse: createContractDto.additionalCourse, // Curso adicional
      name: this.generateContractName(
        {
          firstName: alumn.firstName,
          lastName: alumn.lastName,
        },
        {
          name: course.name,
        },
        uniqueId,
      ),
    });

    // Guardar el contrato en la base de datos
    await this.contractRepository.save(contract);

    return contract; // Devolver el contrato creado
  }

  async findAllByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters: any = {},
  ) {
    const { name, studentName, courseName } = filters;

    const queryBuilder = this.contractRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.alumn', 'alumn')
      .leftJoinAndSelect('contract.course', 'course')
      .leftJoinAndSelect('contract.user', 'user')
      .where('contract.userId = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('contract.createdAt', 'DESC');

    if (name) {
      queryBuilder.andWhere('contract.name ILIKE :name', { name: `%${name}%` });
    }
    if (studentName) {
      queryBuilder.andWhere('alumn.firstName ILIKE :studentName', {
        studentName: `%${studentName}%`,
      });
    }
    if (courseName) {
      queryBuilder.andWhere('course.name ILIKE :courseName', {
        courseName: `%${courseName}%`,
      });
    }

    const [contracts, total] = await queryBuilder.getManyAndCount();

    return {
      data: contracts,
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateContractName = (
    alumn: { firstName: string; lastName: string },
    course: { name: string },
    uniqueId: string,
  ): string => {
    // Extrae los primeros 4 caracteres del nombre, apellido y curso
    const firstNamePart = alumn.firstName.substring(0, 4);
    const lastNamePart = alumn.lastName.substring(0, 4);
    const courseNamePart = course.name.substring(0, 5);
    const uniqueIdPart = uniqueId.substring(0, 7);

    // Combina las partes para formar el nombre del contrato
    return `${firstNamePart}-${lastNamePart}-${courseNamePart}-${uniqueIdPart}`;
  };
}
