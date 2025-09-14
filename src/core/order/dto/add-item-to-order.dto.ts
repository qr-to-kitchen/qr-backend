import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class AddItemToOrderDto {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @ApiProperty({
    example: [
      { branchDishId: 1, quantity: 2, extraBranchDishIds: [1] },
      { branchDishId: 1, quantity: 1 }
    ]
  })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
