import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDishDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: 'string' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  basePrice?: number;
}
