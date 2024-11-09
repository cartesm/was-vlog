import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersType } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload.interface';
import { RegisterDto } from './dto/register.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { GoogleDataProfile } from './interfaces/googleData.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private i18n: I18nService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<Payload> {
    const user: UsersType = await this.usersService.getUserDataByEmail(email);
    if (!user.pass)
      throw new UnauthorizedException(
        this.i18n.t('test.auth.passwordEmpty', {
          lang: I18nContext.current().lang,
        }),
      );
    const verifyPass: Boolean = bcrypt.compareSync(pass, user.pass);
    if (!verifyPass)
      throw new UnauthorizedException(
        this.i18n.t('test.auth.incorrectPass', {
          lang: I18nContext.current().lang,
        }),
      );
    return {
      id: user._id,
      img: user.img,
      username: user.username,
    };
  }

  async loginUser(payload: Payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async loginUserWithGoogle(req: any): Promise<string> {
    const { user }: { user: GoogleDataProfile } = req;
    if (!user) throw new UnauthorizedException();
    const userMatch: UsersType = await this.usersService.getUserDataByEmail(
      user.email,
    );
    if (userMatch)
      return await this.jwtService.signAsync(<Payload>{
        id: userMatch._id,
        username: userMatch.username,
        email: userMatch.name,
        img: userMatch.img,
      });
    const newUser: UsersType = await this.usersService.createUser({
      ...user,
      username: 'user-' + nanoid(),
    });
    return await this.jwtService.signAsync(<Payload>{
      id: newUser._id,
      username: newUser.username,
      email: newUser.name,
      img: newUser.img,
    });
  }

  async registerUser(userData: RegisterDto): Promise<string> {
    const user: UsersType = await this.usersService.createUser(userData);
    return await this.jwtService.signAsync(<Payload>{
      id: user._id,
      email: user.email,
      username: user.username,
      img: user.img,
    });
  }
}
