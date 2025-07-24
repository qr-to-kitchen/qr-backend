import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(userDto: CreateUserDto) {
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
}
