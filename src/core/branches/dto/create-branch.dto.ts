import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @ApiProperty({ example: 'string' })
  address: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  restaurantId: number;

  @IsNumber()
  @ApiProperty({ example: 1 })
  userId: number;
}
