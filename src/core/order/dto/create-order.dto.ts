import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El estado es obligatorio.' })
  @ApiProperty({ example: 'string' })
  status: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  branchId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({
    example: [
      { dishId: 1, quantity: 2 },
      { dishId: 2, quantity: 1 }
    ]
  })
  items: CreateOrderItemDto[];
}
