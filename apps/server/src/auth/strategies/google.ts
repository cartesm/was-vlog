import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleClientId, GoogleClientSecret } from 'src/configs';
import { GoogleDataProfile } from '../interfaces/googleData.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: GoogleClientId,
      clientSecret: GoogleClientSecret,
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user: GoogleDataProfile = {
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value,
    };
    if (profile.photos[0].value) user.img = profile.photos[0].value;
    done(null, user);
  }
}
