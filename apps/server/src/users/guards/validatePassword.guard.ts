import {
  Body,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { UsersType } from '../schemas/users.schema';
import { UsersService } from '../users.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ValidatePasswordGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private i18n: I18nService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any | Boolean> {
    const { user, body }: UserRequest = context.switchToHttp().getRequest();
    const userMatch: UsersType = await this.userService.getPublicUserData(
      user.id,
    );
    if (!userMatch.pass)
      throw new UnauthorizedException(
        this.i18n.t('test.users.notPass', { lang: I18nContext.current().lang }),
      );
    if (!body.validationPassword)
      throw new NotAcceptableException(
        this.i18n.t('test.users.errorPass', {
          lang: I18nContext.current().lang,
        }),
      );
    const passwordMatch: boolean = await bcrypt.compare(
      body.validationPassword,
      userMatch.pass,
    );
    if (!passwordMatch)
      throw new UnauthorizedException(this.i18n.t('test.auth.incorrectPass'));
    return true;
  }
}
