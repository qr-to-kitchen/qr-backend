import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @ApiProperty({ example: 'string' })
  password: string;
}
