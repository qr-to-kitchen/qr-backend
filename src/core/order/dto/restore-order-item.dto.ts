import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RestoreOrderItemDto {
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(1, { message: 'La cantidad debe ser mínimo uno.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @ApiProperty({ example: 'string' })
  comment?: string;

  @IsNumber({}, { message: 'El ID del plato en sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchDishId: number;

  @IsOptional()
  @IsArray({ message: 'Los extras deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los extras no pueden estar vacíos.' })
  @IsNumber({}, { each: true, message: 'Cada extra debe ser un número.' })
  @ApiProperty({ example: [1, 2], required: false })
  extraBranchDishIds?: number[];
}
