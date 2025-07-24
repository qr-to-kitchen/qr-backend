import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @ApiProperty({ example: 'string' })
  name: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  username: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @ApiProperty({ example: 'string' })
  password: string;
}
