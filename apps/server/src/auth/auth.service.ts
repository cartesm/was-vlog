import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersType } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload.interface';
import { RegisterDto } from './dto/register.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private i18n: I18nService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<Payload> {
    const user: UsersType = await this.usersService.getUserDataByEmail(email);
    const verifyPass: Boolean = bcrypt.compareSync(pass, user.pass);
    if (!verifyPass)
      throw new UnauthorizedException(
        this.i18n.t('test.auth.icorrectPass', {
          lang: I18nContext.current().lang,
        }),
      );
    return {
      id: user._id,
      img: user.img,
      username: user.username,
    };
  }

  async loginUser(payload: Payload): Promise<ResponseWithMessage> {
    return {
      message: this.i18n.t('test.auth.loginMessage', {
        lang: I18nContext.current().lang,
      }),
      data: await this.jwtService.signAsync(payload),
    };
  }

  async registerUser(userData: RegisterDto): Promise<ResponseWithMessage> {
    const user: UsersType = await this.usersService.createUser(userData);
    return {
      message: this.i18n.t('test.auth.registerMessage', {
        lang: I18nContext.current().lang,
      }),
      data: await this.jwtService.signAsync(<Payload>{
        id: user._id,
        email: user.email,
        username: user.username,
        img: user.img,
      }),
    };
  }
}
