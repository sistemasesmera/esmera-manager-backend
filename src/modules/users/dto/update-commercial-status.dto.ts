import { IsEnum } from 'class-validator';
import { ActiveStatus } from 'src/constants/ActiveStatus.enum';

export class UpdateCommercialStatusDto {
  @IsEnum(ActiveStatus, {
    message: 'active must be either 1 (activar) or 0 (desactivar)',
  })
  active: ActiveStatus;
}
