import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { CreatePostDto } from './dto/createPost.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { Public } from 'src/auth/decorators/public.decorator';
import { PostsType } from './schemas/post.schema';
import { PageAndUserPipe } from 'src/followers/pipes/page-and-user.pipe';
import { Types } from 'mongoose';
import { promises } from 'dns';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { query } from 'express';
import { SearchPipe } from './pipes/search.pipe';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get('/:name')
  @HttpCode(HttpStatus.OK)
  async getSpecificPost(@Param() param: { name: string }): Promise<PostsType> {
    return this.postsService.getOnePost(param.name);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('user/:user/:page')
  async getUserPost(
    @Query('order', ParseIntPipe) querry: { order: number },
    @Param(PageAndUserPipe) param: { page: number; user: Types.ObjectId },
  ): Promise<any> {
    return this.postsService.getPostOfAnUser(
      param.user,
      param.page,
      querry.order,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('best/:user/:page')
  async getBestOfAnUser(
    @Param(PageAndUserPipe) param: { page: number; user: Types.ObjectId },
  ): Promise<any> {
    return this.postsService.getBestOfAnUser(param.user, param.page);
  }

  @Public()
  @Get('search/:page')
  @HttpCode(HttpStatus.OK)
  async searchPosts(
    @Param('page', ParseIntPipe) param: { page: number },
    @Query(SearchPipe)
    query: {
      name: string;
      tags: Array<Types.ObjectId>;
      created: number;
      alphabetical: number;
    },
  ) {
    const { alphabetical, created, name, tags } = query;
    return await this.postsService.search(
      name,
      param.page,
      created,
      alphabetical,
      tags,
    );
  }

  // ? para tomar posts por tag se usa els easrch con solo el tag

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() body: CreatePostDto,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.postsService.createPost(body, req.user.id);
  }
}
