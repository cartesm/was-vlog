import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { Types } from 'mongoose';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { CreateLikeDto } from './dto/createlike.dto';
import { PageAndUserPipe } from 'src/followers/pipes/page-and-user.pipe';
import { Public } from 'src/auth/decorators/public.decorator';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';

@UseGuards(JwtGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // * rutas de los likes realacionados a posts
  @Post('p')
  @HttpCode(HttpStatus.CREATED)
  async likeAPost(
    @Req() req: UserRequest,
    @Body() body: CreateLikeDto,
  ): Promise<void> {
    return await this.likesService.likePost(req.user.id, body.id);
  }

  //TODO: cambiar el "Page and user pipe" para que sea un generico
  @Public()
  @Get('p/p/:user/:page')
  async getLikesByPost(
    @Param(PageAndUserPipe) param: { user: Types.ObjectId; page: number },
  ) {
    return await this.likesService.getUsersThatLikePost(param.user, param.page);
  }

  @Delete('p/:id')
  async deleteLikePost(
    @Param(ParseidPipe) param: { id: Types.ObjectId },
    @Req() req: UserRequest,
  ): Promise<void> {
    return await this.likesService.deleteLikePost(param.id, req.user.id);
  }

  @Get('p/liked/:id')
  async isLikedPost(
    @Param(ParseidPipe) param: { id: Types.ObjectId },
    @Req() req: UserRequest,
  ): Promise<boolean> {
    return await this.likesService.isLikedPost(param.id, req.user.id);
  }

  // * seccion de likes de comentarios
}
