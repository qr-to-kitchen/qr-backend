import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  userId: number;
}
