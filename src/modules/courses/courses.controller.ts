import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Query,
  Param,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { PaginationDto } from './dto/PaginationDto.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { UserData } from 'src/decorators/user.decorator';
import { AuthenticatedUser } from 'src/interfaces/authenticated-user.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  create(@Body() createCourseDto: CreateCourseDto, @UserData() user: AuthenticatedUser) {
    return this.coursesService.create(createCourseDto, user);
  }

  @Get()
  findAllCourses(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    paginationDto: PaginationDto,
  ) {
    const { page, limit, searchTerm } = paginationDto;

    console.log('first');
    return this.coursesService.findAllCourses(page, limit, searchTerm);
  }

  @Get('selects')
  findAll() {
    return this.coursesService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UserData() user: AuthenticatedUser,
  ) {
    return this.coursesService.update(id, updateCourseDto, user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.coursesService.updateStatus(id, isActive);
  }
}
