import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El orden debe ser un número.' })
  @Min(1, { message: 'El orden debe ser mínimo uno.' })
  @ApiProperty({ example: 1 })
  displayOrder?: number;

  @IsOptional()
  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  visible?: boolean;
}
