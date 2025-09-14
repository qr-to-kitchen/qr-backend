import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDishDto {
  @IsOptional()
  @IsNumber({}, { message: 'El precio personalizado debe ser un número.' })
  @Min(0, { message: 'El precio personalizado no puede ser negativo.' })
  @ApiProperty({ example: 15, required: false })
  @Type(() => Number)
  customPrice?: number;

  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  @Type(() => Boolean)
  isAvailable: boolean;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;

  @IsNumber({}, { message: 'El ID del plato debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  dishId: number;
}