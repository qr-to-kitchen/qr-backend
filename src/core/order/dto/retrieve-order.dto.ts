import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RetrieveOrderDto {
  @IsNumber({}, { message: 'El identificador de la mesa debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  tableNumber: number;

  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;

  @IsNotEmpty({ message: 'El código diario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  dailyCode: string;

  @IsNumber({}, { message: 'El identificador de la orden debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  orderId: number;
}
