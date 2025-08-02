import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(1, { message: 'La cantidad debe ser mínimo uno.' })
  @ApiProperty({ example: 1 })
  quantity: number;

  @IsNumber({}, { message: 'El ID del plato en sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchDishId: number;

  unitPrice: number;
}
