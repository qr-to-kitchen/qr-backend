import { IsBoolean, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateExtraDto {
  @IsNotEmpty({ message: 'El nombre del extra es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsNumber({}, { message: 'El ID del restaurante debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  restaurantId: number;

  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  basePrice: number;

  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  @Type(() => Boolean)
  saveInAllBranches: boolean;
}
