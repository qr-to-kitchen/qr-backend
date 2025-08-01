import { IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';
import { OrderStatus } from '../entity/order.entity';

export class CreateOrderDto {
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El identificador de la mesa debe ser un número.' })
  tableNumber: number;

  @IsEnum(OrderStatus, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREADO })
  status: OrderStatus;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({
    example: [
      { branchDishId: 1, quantity: 2 },
      { branchDishId: 1, quantity: 1 }
    ]
  })
  items: CreateOrderItemDto[];
}
