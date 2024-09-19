import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRequest } from './interfaces/userRequest.interface';
import { RegisterDto } from './dto/register.dto';
import { GoogleGuard } from './guards/google.guard';
import { Request, Response } from 'express';
import { frontUrl } from 'src/configs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: UserRequest) {
    return await this.authService.loginUser(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() Body: RegisterDto) {
    return await this.authService.registerUser(Body);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Get('google-redirect')
  @UseGuards(GoogleGuard)
  async googleRedirect(@Req() req: Request, @Res() resp: Response) {
    const token: string = await this.authService.loginUserWithGoogle(req);
    const sixHoursInMiliseconds: number = 21600000;
    let redirectUrl: string;
    if (!req.cookies['redirect-url']) redirectUrl = frontUrl;
    else redirectUrl = req.cookies['redirect-url'];
    resp.cookie('was-auth-token', token, {
      maxAge: sixHoursInMiliseconds,
    });
    resp.redirect(redirectUrl);
  }
}
