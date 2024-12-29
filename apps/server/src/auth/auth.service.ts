import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersType } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './interfaces/payload.interface';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { GoogleDataProfile } from './interfaces/googleData.interface';
import { ExceptionsService } from 'src/utils/exceptions.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private i18n: I18nService,
    private jwtService: JwtService,
    private exceptions: ExceptionsService,
  ) {}
  async validateUser(email: string, pass: string): Promise<Payload> {
    const user: UsersType = await this.usersService.getUserDataByEmail(email);
    //!
    if (!user) this.exceptions.throwNotFound('test.users.notFound');

    if (!user.pass)
      this.exceptions.throwUnauthorized('test.auth.passwordEmpty');

    const verifyPass: Boolean = bcrypt.compareSync(pass, user.pass);
    if (!verifyPass)
      this.exceptions.throwUnauthorized('test.auth.incorrectPass');
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
    console.log('va a buscar');
    const userMatch: UsersType = await this.usersService.getUserDataByEmail(
      user.email,
    );
    console.log('user match: ' + userMatch);
    console.log('despues del user match');
    if (userMatch)
      return await this.jwtService.signAsync(<Payload>{
        id: userMatch._id,
        username: userMatch.username,
        email: userMatch.name,
        img: userMatch.img,
      });
    console.log('no existe');
    console.log(user);
    const newUser: UsersType = await this.usersService.createUser({
      ...user,
      username: 'user-' + nanoid(),
    });
    console.log('new user: ' + newUser);
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
