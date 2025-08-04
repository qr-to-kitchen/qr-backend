import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExtraBranchDishDto {
  @IsNumber({}, { message: 'El ID del item extra debe ser un número.' })
  @ApiProperty({ example: 1 })
  extraId: number;

  @IsNumber({}, { message: 'El ID del plato en sucursal debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchDishId: number;
}