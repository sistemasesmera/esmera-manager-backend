import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  searchTerm?: string; // Agrega el campo name
}
