import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @ApiProperty({ example: 1 })
  userId: number;
}
