import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Category } from '../../categories/categories.entity';

export class UpdateDishDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @ApiProperty({ example: 'string' })
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El precio base es obligatorio.' })
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsNotEmpty({ message: 'El ID de la categoría es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la categoría debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  categoryId?: number;

  category?: Category;
}
