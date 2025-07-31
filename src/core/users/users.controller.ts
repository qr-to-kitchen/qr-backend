import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post, Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() userDto: RegisterUserDto) {
    return this.usersService.register(userDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() userDto: LoginUserDto) {
    return this.usersService.login(userDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteById(id);
  }

  @Post('send-verification-code')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendVerificationCode(@Body() sendCodeDto: SendCodeDto) {
    return this.usersService.sendVerificationCode(sendCodeDto.email);
  }

  @Post('verify-code')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.usersService.verifyCode(verifyCodeDto.email, verifyCodeDto.code);
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto.email, resetPasswordDto.password);
  }
}
