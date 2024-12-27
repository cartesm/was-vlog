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
import { Public } from 'src/auth/decorators/public.decorator';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { CreateCommentLikeDto } from './dto/createCommentLike.to';
import { PageAndIdPipe } from 'src/utils/pipes/page-and-id.pipe';
import { IPageAndId } from 'src/utils/interfaces/pageAndId.interface';

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
  ): Promise<{ status: 'Create' | 'Delete' }> {
    return await this.likesService.likePost(req.user.id, body.id);
  }

  @Public()
  @Get('p/p/:id/:page')
  @HttpCode(HttpStatus.OK)
  async getLikesByPost(@Param(PageAndIdPipe) param: IPageAndId) {
    return await this.likesService.getUsersThatLikePost(param.id, param.page);
  }

  // * seccion de likes de comentarios

  @Post('c')
  @HttpCode(HttpStatus.CREATED)
  async likeAComment(
    @Req() req: UserRequest,
    @Body() body: CreateCommentLikeDto,
  ): Promise<{ status: 'Create' | 'Delete' }> {
    return await this.likesService.likeComment(
      req.user.id,
      body.commentId,
      body.postId,
    );
  }

  @Get('c/:id')
  @HttpCode(HttpStatus.OK)
  async getAllLikesOnAPost(
    @Param(ParseidPipe)
    param: ParamId,
    @Req() req: UserRequest,
  ): Promise<Array<{ _id: Types.ObjectId }>> {
    return await this.likesService.getAllLikesInAPost(req.user.id, param.id);
  }

  @Get('c/:id/:page')
  @HttpCode(HttpStatus.OK)
  async getCommentLikesOfAUser(
    @Param(PageAndIdPipe) param: IPageAndId,
  ): Promise<any> {
    return await this.likesService.getAllCommentLikes(param.id, param.page);
  }
}
