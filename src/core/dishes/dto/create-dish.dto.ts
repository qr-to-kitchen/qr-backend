import { IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateDishDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description: string;

  @IsNotEmpty({ message: 'El precio base es obligatorio.' })
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  basePrice: number;

  @IsNotEmpty({ message: 'El ID del restaurante es obligatorio.' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  restaurantId: number;

  @IsNotEmpty({ message: 'El ID de la categoría es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la categoría debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  categoryId: number;

  @IsNotEmpty({ message: 'Este campo es obligatorio.' })
  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  @Transform(({ value }) => value === 'true')
  saveInAllBranches: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}