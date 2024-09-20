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
import { frontUrl, sixHoursInMiliseconds } from 'src/configs';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private i18n: I18nService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: UserRequest,
    @Res() resp: Response,
  ): Promise<Response> {
    const token: string = await this.authService.loginUser(req.user);
    resp.cookie('was_auth_token', token, {
      maxAge: sixHoursInMiliseconds,
    });
    return resp.send({
      message: this.i18n.t('test.auth.loginMessage', {
        lang: I18nContext.current().lang,
      }),
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res() resp: Response,
    @Body() Body: RegisterDto,
  ): Promise<Response | any> {
    const token: string = await this.authService.registerUser(Body);
    resp.cookie('was_auth_token', token, {
      maxAge: sixHoursInMiliseconds,
    });
    return resp.send({
      message: this.i18n.t('test.auth.registerMessage', {
        lang: I18nContext.current().lang,
      }),
    });
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Get('google-redirect')
  @UseGuards(GoogleGuard)
  async googleRedirect(@Req() req: Request, @Res() resp: Response) {
    const token: string = await this.authService.loginUserWithGoogle(req);
    const redirectUrl: string = req.cookies.redirect_url || frontUrl;
    resp.cookie('was_auth_token', token, {
      maxAge: sixHoursInMiliseconds,
      httpOnly: false,
    });
    return resp.redirect(redirectUrl);
  }
}
