import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  Matches,
  IsISO8601,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month_year should be in the format YYYY-MM',
  })
  month_year: string; // Ejemplo: "2024-12"

  @IsInt()
  @IsNotEmpty()
  common_goal: number; // Ejemplo: 100000 (objetivo en euros)

  @IsInt()
  @IsNotEmpty()
  contracts_goal: number; // Ejemplo: 50 (objetivo en contratos)

  @IsArray()
  @IsISO8601({}, { each: true }) // Validar que cada fecha en holidays esté en formato ISO 8601 (YYYY-MM-DD)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    each: true,
    message: 'Each holiday must be in the format YYYY-MM-DD',
  })
  holidays: string[]; // Ejemplo: ["2024-09-08", "2024-09-25"]
  @IsInt()
  @IsOptional() // Este campo es calculado automáticamente
  days_in_month?: number; // Días laborables en el mes
}
