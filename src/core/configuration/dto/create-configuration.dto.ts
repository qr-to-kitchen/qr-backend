import { IsHexColor, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigurationDto {
  @IsHexColor({ message: "El color debe ser en formato hexadecimal."})
  @ApiProperty({ example: '#000000' })
  primaryColor: string;

  @IsNotEmpty({ message: 'La imagen de fondo es obligatoria.'})
  @ApiProperty({ example: 'string' })
  backgroundImage: string;

  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @ApiProperty({ example: 1 })
  restaurantId: number;
}
