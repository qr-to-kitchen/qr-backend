import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @ApiProperty({ example: 'string' })
  password: string;
}
