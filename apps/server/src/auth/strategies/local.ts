import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Payload } from '../interfaces/payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'pass',
    });
  }
  async validate(email: string, pass: string): Promise<Payload> {
    return this.authService.validateUser(email, pass);
  }
}
