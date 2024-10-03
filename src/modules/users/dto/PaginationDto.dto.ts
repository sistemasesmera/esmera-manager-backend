import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'page must not be less than 1' })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 5;

  @IsOptional()
  @IsString()
  email?: string;

  // Filtro opcional por estado (1 para true, 0 para false)
  @IsOptional()
  @IsIn([0, 1], { message: 'Active must be either 1 (true) or 0 (false)' })
  @Type(() => Number)
  active?: number; // Ahora es un número, no un booleano
}
