import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDishDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  basePrice: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  restaurantId: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la categoría debe ser un número.' })
  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}