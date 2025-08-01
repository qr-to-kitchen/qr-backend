import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBranchDishDto {
  @IsOptional()
  @IsNumber({}, { message: 'El precio personalizado debe ser un número.' })
  @Min(0, { message: 'El precio personalizado no puede ser negativo.' })
  @ApiProperty({ example: 15 })
  customPrice?: number;

  @IsOptional()
  @IsBoolean({ message: 'Este campo debe ser verdadero o falso.' })
  @ApiProperty({ example: true })
  isAvailable?: boolean;
}
