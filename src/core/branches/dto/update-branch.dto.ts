import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBranchDto {
  @IsOptional()
  @ApiProperty({ example: 'string' })
  address?: string;
}
