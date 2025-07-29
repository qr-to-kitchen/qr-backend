import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDishDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  dishId: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio personalizado debe ser un número.' })
  @Min(0, { message: 'El precio personalizado no puede ser negativo.' })
  @ApiProperty({ example: 15, required: false })
  customPrice?: number;

  @IsBoolean()
  @ApiProperty({ example: true })
  isAvailable: boolean;
}