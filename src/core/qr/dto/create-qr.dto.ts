import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQrDto {
  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;

  @IsNumber({}, { message: 'El identificador de la mesa debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  tableNumber: number;
}
