import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrUpdateBranchDishDto {
  @IsOptional()
  @IsNumber({}, { message: 'El ID del plato en sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio personalizado debe ser un número.' })
  @Min(0, { message: 'El precio personalizado no puede ser negativo.' })
  @ApiProperty({ example: 15 })
  @Type(() => Number)
  customPrice?: number;

  @IsOptional()
  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  @Type(() => Boolean)
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del plato debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  dishId?: number;
}
