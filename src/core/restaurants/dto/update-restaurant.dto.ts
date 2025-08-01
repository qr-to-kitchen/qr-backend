import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name?: string;
}
