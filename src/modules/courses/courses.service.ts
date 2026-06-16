import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly auditLogService: AuditLogService,
  ) {}

  // Método para crear un nuevo curso
  async create(createCourseDto: CreateCourseDto, user?: AuthenticatedUser): Promise<Course> {
    const newCourse = this.courseRepository.create(createCourseDto);
    const saved = await this.courseRepository.save(newCourse);

    if (user) {
      void this.auditLogService.log({
        userId: user.id,
        userEmail: user.email,
        action: 'CURSO_CREADO',
        entityType: 'Course',
        entityId: saved.id,
        details: { name: saved.name },
      });
    }

    return saved;
  }

  async findAll() {
    return await this.courseRepository.find({
      where: { isActive: true },
    });
  }

  // Método para obtener todos los cursos con paginación
  async findAllCourses(
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
  ) {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    if (searchTerm) {
      queryBuilder.where('course.name ILIKE :name', {
        name: `%${searchTerm}%`,
      });
    }
    queryBuilder.orderBy('course.createdAt', 'DESC');

    const [result, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      page,
      limit,
      data: result,
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, user?: AuthenticatedUser): Promise<Course> {
    if (!this.isValidUUID(id)) {
      throw new NotFoundException(`ID ${id} no es un UUID válido`);
    }

    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    if (updateCourseDto.name) {
      course.name = updateCourseDto.name;
    }

    const saved = await this.courseRepository.save(course);

    if (user) {
      void this.auditLogService.log({
        userId: user.id,
        userEmail: user.email,
        action: 'CURSO_ACTUALIZADO',
        entityType: 'Course',
        entityId: id,
        details: { name: saved.name },
      });
    }

    return saved;
  }

  // Método para validar si un ID es un UUID
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async updateStatus(id: string, isActive: boolean): Promise<Course> {
    if (!this.isValidUUID(id)) {
      throw new NotFoundException(`ID ${id} no es un UUID válido`);
    }

    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    course.isActive = isActive;

    return this.courseRepository.save(course);
  }
}
