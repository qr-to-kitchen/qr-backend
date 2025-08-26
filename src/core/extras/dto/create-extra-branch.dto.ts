import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExtraBranchDto {
  @IsNumber({}, { message: 'El ID del item extra debe ser un número.' })
  @ApiProperty({ example: 1 })
  extraId: number;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchId: number;
}