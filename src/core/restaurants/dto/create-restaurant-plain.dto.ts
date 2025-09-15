import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantPlainDto {
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;
}
