import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExtraDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  name?: string;
}
