import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entity/users.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  @ApiProperty({ example: 'string' })
  email?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @ApiProperty({ example: 'string' })
  username?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN o BRANCH' })
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role?: UserRole;
}
