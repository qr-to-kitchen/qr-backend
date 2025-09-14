import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBranchPlainDto {
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiProperty({ example: 'string' })
  address: string;

  @IsNotEmpty({ message: 'El ID del restaurante es obligatorio.' })
  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  restaurantId: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la sede de origen debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  sourceBranchId?: number;
}
