import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RestoreOrderItemDto } from './restore-order-item.dto';

export class RestoreOrderDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  description?: string;

  @IsNumber({}, { message: 'El identificador de la mesa debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  tableNumber: number;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;

  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @Type(() => RestoreOrderItemDto)
  @ApiProperty({
    example: [
      { branchDishId: 1, quantity: 2, extraBranchDishIds: [1] },
      { branchDishId: 1, quantity: 1 }
    ]
  })
  items: RestoreOrderItemDto[];
}
