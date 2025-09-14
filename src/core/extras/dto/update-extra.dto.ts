import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateExtraDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio base debe ser un número.' })
  @Min(0, { message: 'El precio base no puede ser negativo.' })
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  basePrice?: number;
}
