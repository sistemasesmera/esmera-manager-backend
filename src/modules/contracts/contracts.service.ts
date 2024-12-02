import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { Contract } from './entities/contract.entity';
import { User } from '../users/entities/user.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Course } from '../courses/entities/course.entity';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';
import { v4 as uuidv4 } from 'uuid';
import { ReportFiltersDto } from './dto/report-filters.dto';

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

    if (!alumn.isVerified) {
      throw new BadRequestException(`Alumn not verified`);
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
      coursePrice: parseInt(createContractDto.coursePrice), // Precio del curso
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
      presentationDate: createContractDto.presentationDate
        ? new Date(createContractDto.presentationDate)
        : null, // Fecha presentacion
      courseStartDate: createContractDto.courseStartDate
        ? new Date(createContractDto.courseStartDate)
        : null, // Fecha inicio
      courseEndDate: createContractDto.courseEndDate
        ? new Date(createContractDto.courseEndDate)
        : null, // Fecha finalizacion
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

  async getContractsForCurrentMonth(): Promise<Contract[]> {
    const today = new Date();
    const currentMonth = today.getMonth(); // Mes actual (0-11)
    const currentYear = today.getFullYear(); // Año actual

    // Calcular el rango del mes actual
    const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0); // Primer segundo del mes
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59); // Último segundo del mes

    // Obtener los contratos del mes actual
    const contracts = await this.contractRepository.find({
      where: {
        createdAt: Between(startOfMonth, endOfMonth), // Rango ajustado
      },
      relations: ['user'], // Relacionamos con 'user'
      select: {
        id: true, // Traemos el campo 'id' del contrato
        coursePrice: true, // Traemos el campo 'amount' del contrato
        createdAt: true, // Traemos la fecha del contrato
        user: {
          // Relación con 'user'
          firstName: true, // Solo traemos el 'firstName' del 'user'
          lastName: true, // Solo traemos el 'lastName' del 'user'
          id: true, // Solo traemos el 'id' del contrato
        },
      },
    });

    return contracts;
  }

  async getReport(filters: ReportFiltersDto) {
    const { startDate, endDate, courseId, userId } = filters;

    // Convertir las fechas a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validación: asegurarse de que endDate no sea anterior a startDate
    if (end < start) {
      throw new Error(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }

    // Validación: no permitir un rango de fechas superior a 2 años
    const maxAllowedRange = 730; // 2 años en días
    const timeDifference =
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Calculamos la diferencia en días

    if (timeDifference > maxAllowedRange) {
      throw new Error(
        'El rango de fechas no puede ser mayor a 2 años (730 días).',
      );
    }

    // Iniciar la consulta de contratos
    const query = this.contractRepository.createQueryBuilder('contract');

    // Seleccionar solo los campos necesarios de la entidad contract
    query
      .select([
        'contract.id', // Campo id de contract (debe ser seleccionado explícitamente)
        'contract.name', // Nombre del contrato
        'contract.paymentAgreement', // Acuerdo de pago
        'contract.coursePrice', // Precio del curso
        'contract.createdAt', // Fecha de creación del contrato
      ])
      .leftJoin('contract.alumn', 'alumn') // Relación con Alumno
      .leftJoin('contract.course', 'course') // Relación con Curso
      .leftJoin('contract.user', 'user') // Relación con Comercial
      .addSelect([
        'alumn.firstName', // Primer nombre del Alumno
        'alumn.id', // Primer nombre del Alumno
        'alumn.lastName', // Apellido del Alumno
        'course.name', // Nombre del Curso
        'course.id', // Nombre del Curso
        'user.firstName', // Nombre del Comercial
        'user.id', // Nombre del Comercial
        'user.lastName', // Apellido del Comercial
      ])
      .where('contract.createdAt >= :startDate', {
        startDate: new Date(startDate + 'T00:00:00Z'),
      })
      .andWhere('contract.createdAt <= :endDate', {
        endDate: new Date(endDate + 'T23:59:59Z'),
      });

    // Filtrar por curso (opcional)
    if (courseId) {
      query.andWhere('contract.courseId = :courseId', { courseId });
    }

    // Filtrar por comercial (opcional)
    if (userId) {
      query.andWhere('contract.userId = :userId', { userId });
    }

    // Obtener los contratos filtrados
    const contracts = await query.getMany();

    // Calcular los datos generales del reporte
    return {
      summary: {
        totalContracts: contracts.length,
        totalAmount: contracts.reduce(
          (sum, contract) => sum + contract.coursePrice,
          0,
        ),
        firstContractDate: contracts.length ? contracts[0].createdAt : null,
        lastContractDate: contracts.length
          ? contracts[contracts.length - 1].createdAt
          : null,
      },
      contracts,
    };
  }
}
