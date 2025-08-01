import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDishDto {
  @IsOptional()
  @IsNumber({}, { message: 'El precio personalizado debe ser un número.' })
  @Min(0, { message: 'El precio personalizado no puede ser negativo.' })
  @ApiProperty({ example: 15, required: false })
  customPrice?: number;

  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  isAvailable: boolean;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsNumber({}, { message: 'El ID del plato debe ser un número.' })
  @ApiProperty({ example: 1 })
  dishId: number;
}