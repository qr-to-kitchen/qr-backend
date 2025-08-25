import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchPlainDto {
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiProperty({ example: 'string' })
  address: string;

  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  restaurantId: number;
}
