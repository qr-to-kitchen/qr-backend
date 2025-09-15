import { RegisterUserDto } from '../../users/dto/register-user.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantPlainDto } from './create-restaurant-plain.dto';

export class CreateRestaurantUserDto {
  @ValidateNested({ each: true, message: 'El usuario debe ser válido.' })
  @ApiProperty({ type: () => RegisterUserDto })
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @ValidateNested({ each: true, message: 'El restaurant debe ser válida.' })
  @ApiProperty({ type: () => CreateRestaurantPlainDto })
  @Type(() => CreateRestaurantPlainDto)
  restaurant: CreateRestaurantPlainDto;
}