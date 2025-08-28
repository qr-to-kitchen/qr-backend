import { IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrdersByFilterDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de la sede debe ser un número.' })
  @ApiProperty({ example: 1 })
  branchId: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El número de página debe ser un número.' })
  @ApiProperty({ example: 1 })
  page: number;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser correcta.' })
  @ApiProperty({ example: '2025-01-01T22:00:00.000Z' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin debe ser correcta.' })
  @ApiProperty({ example: '2025-02-01T21:59:59.999Z' })
  endDate: Date;
}