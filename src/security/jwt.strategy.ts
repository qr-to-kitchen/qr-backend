import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../core/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'Secret_Key_Qr_Kitchen_Back_022506'
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Token inválido debido a cambio de contraseña');
    }

    return { id: payload.sub };
  }
}