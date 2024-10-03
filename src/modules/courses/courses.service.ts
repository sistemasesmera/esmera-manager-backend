import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';

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
}
