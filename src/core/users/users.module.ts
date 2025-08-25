import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../security/jwt.strategy';
import { MailService } from '../../mail/mail.service';
import { VerificationCode } from './entity/verification-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerificationCode]),
    JwtModule.register({
      secret: 'Secret_Key_Qr_Kitchen_Back_022506',
      signOptions: { expiresIn: '1w' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, MailService]
})
export class UsersModule {}
