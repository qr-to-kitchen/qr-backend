import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }
}
