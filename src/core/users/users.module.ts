import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../security/jwt.strategy';
import { MailService } from '../../mail/mail.service';
import { VerificationCode } from './entity/verification-code.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User, VerificationCode]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'Secret_Key_Qr_Kitchen_Back_022506',
      signOptions: { expiresIn: '1w' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, MailService]
})
export class UsersModule {}
