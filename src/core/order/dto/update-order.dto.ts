import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../entity/order.entity';

export class UpdateOrderDto {
  @IsEnum(OrderStatus, { message: 'El estado enviado es incorrecto.' })
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREADO })
  status: OrderStatus;
}
