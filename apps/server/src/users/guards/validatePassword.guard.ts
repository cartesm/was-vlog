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
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class ValidatePasswordGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private exceptions: ExceptionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any | Boolean> {
    const { user, body }: UserRequest = context.switchToHttp().getRequest();
    const userMatch: UsersType = await this.userService.getPublicUserData(
      user.id,
    );
    if (!userMatch.pass)
      this.exceptions.throwNotAceptable('test.users.notPass');
    if (!body.validationPassword)
      this.exceptions.throwNotAceptable('test.users.errorPass');
    const passwordMatch: boolean = await bcrypt.compare(
      body.validationPassword,
      userMatch.pass,
    );
    if (!passwordMatch)
      this.exceptions.throwNotAceptable('test.auth.incorrectPass');
    return true;
  }
}
