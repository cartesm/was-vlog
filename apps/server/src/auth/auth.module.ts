import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { LocalStrategy } from './strategies/local';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ExpiresInJwt, JwtSecret } from 'src/configs';
import { JwtStrategy } from './strategies/jwt';
import { GoogleStrategy } from './strategies/google';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: JwtSecret,
      verifyOptions: {
        ignoreExpiration: false,
      },
      signOptions: {
        expiresIn: ExpiresInJwt,
      },
    }),
  ],
})
export class AuthModule {}
