import { IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExtraBranchDishDto {
  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  isAvailable: boolean;

  @IsNumber({}, { message: 'El ID del item extra en la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  extraBranchId: number;

  @IsNumber({}, { message: 'El ID del plato en la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchDishId: number;
}