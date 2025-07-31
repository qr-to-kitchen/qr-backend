import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../../mail/mail.service';
import { VerificationCode } from './entity/verification-code.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, username, password } = registerUserDto;

    const userExisting = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (userExisting) {
      throw new BadRequestException({
        message: ['Email o username ya están en uso.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword
    });

    return this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username }
    });
    if (!user) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException({
        message: ['Correo o contraseña inválidos.'],
        error: "Unauthorized",
        statusCode: 401
      });
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return user;
  }

  getAll() {
    return this.userRepository.find();
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      if (existingUser) {
        throw new ConflictException({
          message: ['El correo electrónico ya está en uso.'],
          error: 'Conflict',
          statusCode: 409
        });
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username }
      });

      if (existingUser) {
        throw new ConflictException({
          message: ['El nombre de usuario ya está en uso.'],
          error: 'Conflict',
          statusCode: 409
        });
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOneBy({ id });
  }

  async deleteById(id: number) {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Usuario eliminado correctamente.'
      }
    }
  }

  async sendVerificationCode(email: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailService.sendVerificationCodeEmail(email, code);

    const verificationCode = this.verificationCodeRepository.create({
      code: code,
      isUsed: false,
      user: user,
    });

    await this.verificationCodeRepository.save(verificationCode);

    return {
      message: 'Correo enviado correctamente.'
    };
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        user: { id: user.id },
        code,
        isUsed: false,
      },
      order: { createdAt: 'DESC' }
    });
    if (!verificationCode) {
      throw new BadRequestException({
        message: ['Código ya usado o inválido.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    verificationCode.isUsed = true;
    await this.verificationCodeRepository.save(verificationCode);

    return {
      message: 'Código validado correctamente.'
    };
  }

  async resetPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.update(user.id, { password: hashedPassword });

    return {
      message: 'Contraseña actualizada correctamente.'
    };
  }
}
