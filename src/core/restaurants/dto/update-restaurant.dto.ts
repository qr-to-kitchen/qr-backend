import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del restaurante es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name?: string;
}
