import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { PaginationDto } from './dto/PaginationDto.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAllCourses(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, searchTerm } = paginationDto; // Extrae name
    return this.coursesService.findAllCourses(page, limit, searchTerm);
  }

  @Get('selects')
  findAll() {
    return this.coursesService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }
}
