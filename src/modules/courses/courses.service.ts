import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Método para crear un nuevo curso
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    // Crea una nueva instancia de la entidad Course
    const newCourse = this.courseRepository.create(createCourseDto);

    // Guarda el nuevo curso en la base de datos
    return await this.courseRepository.save(newCourse);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  // Método para obtener todos los cursos con paginación
  async findAllCourses(page: number = 1, limit: number = 10, name?: string) {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');

    if (name) {
      queryBuilder.where('course.name ILIKE :name', { name: `%${name}%` }); // Filtra por nombre
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

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Verifica que el id sea un UUID válido
    if (!this.isValidUUID(id)) {
      throw new NotFoundException(`ID ${id} no es un UUID válido`);
    }

    // Buscar el curso por ID
    const course = await this.courseRepository.findOne({ where: { id } });

    // Verificar si el curso existe
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    // Actualizar los campos solo si se proporcionan
    if (updateCourseDto.name) {
      course.name = updateCourseDto.name; // Actualizar nombre
    }

    if (updateCourseDto.price) {
      course.price = updateCourseDto.price; // Actualizar precio
    }

    // Guardar el curso actualizado en la base de datos
    return this.courseRepository.save(course); // Guardar y devolver el curso actualizado
  }

  // Método para validar si un ID es un UUID
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
