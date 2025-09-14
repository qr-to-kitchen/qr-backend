import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/users.entity';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @ApiProperty({ example: 'string' })
  password: string;

  @IsNotEmpty({ message: 'El rol es obligatorio.' })
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN o BRANCH.' })
  @ApiProperty({ enum: UserRole, example: UserRole.BRANCH })
  role: UserRole;
}
