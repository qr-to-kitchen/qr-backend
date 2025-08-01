import { IsHexColor, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigurationDto {
  @IsOptional()
  @IsHexColor({ message: "El color debe ser en formato hexadecimal."})
  @ApiProperty({ example: '#000000' })
  primaryColor?: string;

  @IsOptional()
  @ApiProperty({ example: 'string' })
  primaryFont?: string;
}
