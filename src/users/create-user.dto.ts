import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  username: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
