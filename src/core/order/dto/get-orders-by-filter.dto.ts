import { IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersByFilterDto {
  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  branchId: number;

  @IsNumber({}, { message: 'El número de página debe ser un número.' })
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  page: number;

  @IsDate({ message: 'La fecha de inicio debe ser correcta.' })
  @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
  @Type(() => Date)
  startDate: Date;

  @IsDate({ message: 'La fecha de fin debe ser correcta.' })
  @ApiProperty({ example: '2025-02-01T21:59:59.999Z' })
  @Type(() => Date)
  endDate: Date;
}