import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderStatusItem } from '../entity/order-item.entity';

export class UpdateOrderItemsDto {
  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @Type(() => UpdateOrderItem)
  @ApiProperty({
    example: [
      { branchDishId: 1, quantity: 2, extraBranchDishIds: [1] },
      { branchDishId: 1, quantity: 1 }
    ]
  })
  items: UpdateOrderItem[];
}

export class UpdateOrderItem {
  @IsEnum(OrderStatusItem, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: OrderStatusItem, example: OrderStatusItem.COCINANDO })
  status: OrderStatusItem;

  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del item de la orden debe ser un número.' })
  @ApiProperty({ example: 1 })
  id: number;
}