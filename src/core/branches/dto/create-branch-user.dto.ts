import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBranchPlainDto } from './create-branch-plain.dto';

export class CreateBranchUserDto {
  @ValidateNested({ each: true, message: 'El usuario debe ser válido.' })
  @Type(() => RegisterUserDto)
  @ApiProperty({ type: () => RegisterUserDto })
  user: RegisterUserDto;

  @ValidateNested({ each: true, message: 'La sede debe ser válida.' })
  @Type(() => CreateBranchPlainDto)
  @ApiProperty({ type: () => CreateBranchPlainDto })
  branch: CreateBranchPlainDto;
}