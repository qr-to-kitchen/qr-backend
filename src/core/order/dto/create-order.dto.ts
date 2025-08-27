import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { OrderStatus } from '../entity/order.entity';

export class CreateOrderDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  description?: string;

  @IsNumber({}, { message: 'El identificador de la mesa debe ser un número.' })
  @ApiProperty({ example: 1 })
  tableNumber: number;

  @IsEnum(OrderStatus, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.COCINANDO })
  status: OrderStatus;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsArray({ message: 'Los items deben ser una lista.' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos.' })
  @ValidateNested({ each: true, message: 'Cada item debe ser válido.' })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({
    example: [
      { branchDishId: 1, quantity: 2, extraBranchDishIds: [1] },
      { branchDishId: 1, quantity: 1 }
    ]
  })
  items: CreateOrderItemDto[];
}
