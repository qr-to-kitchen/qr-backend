import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Category } from '../../categories/categories.entity';

export class UpdateDishDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: 'string' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  basePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la categoría debe ser un número.' })
  @ApiProperty({ example: 1 })
  categoryId?: number;

  category?: Category;
}
