import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiProperty({ example: 'string' })
  address: string;

  @IsNotEmpty({ message: 'El ID del restaurante es obligatorio.' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  restaurantId: number;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  userId: number;
}
