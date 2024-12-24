import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../interfaces/userRequest.interface';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean | Observable<Boolean> | any> {
    const req: UserRequest = await context.switchToHttp().getRequest();
    console.log(req.headers.authorization);
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic && !req.headers.authorization) {
      return true;
    }

    return super.canActivate(context);
  }
}
