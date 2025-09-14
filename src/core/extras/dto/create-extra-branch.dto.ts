import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateExtraBranchDto {
  @IsNumber({}, { message: 'El ID del item extra debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  extraId: number;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;
}