import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNumber({}, { message: 'El orden debe ser un número.' })
  @Min(1, { message: 'El orden debe ser mínimo uno.' })
  @ApiProperty({ example: 1 })
  displayOrder: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  restaurantId: number;
}
