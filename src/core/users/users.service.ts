import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, private jwtService: JwtService
  ) {}

  async create(userDto: RegisterUserDto) {
    const { email, username, password } = userDto;

    const existing = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existing) {
      throw new BadRequestException({
        message: ['Email o username ya están en uso.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword
    });

    return this.userRepository.save(newUser);
  }

  async login(userDto: LoginUserDto) {
    const { username, password } = userDto;

    const user = await this.userRepository.findOne({
      where: { username }
    });
    if (!user) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}
