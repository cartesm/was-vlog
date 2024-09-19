import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtSecret } from 'src/configs';
import { Payload } from '../interfaces/payload.interface';
import { UsersService } from 'src/users/users.service';
import { UsersType } from 'src/users/schemas/users.schema';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecret,
    });
  }
  async validate(payload: Payload) {
    const user: UsersType = await this.usersService.getPublicUserData(
      payload.id,
    );
    if (!user)
      throw new UnauthorizedException(
        this.i18n.t('test.users.notFound', {
          lang: I18nContext.current().lang,
        }),
      );
    return payload;
  }
}
