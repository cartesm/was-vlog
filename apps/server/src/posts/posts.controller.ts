import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { Types } from 'mongoose';
import { SearchPipe } from './pipes/search.pipe';
import { UpdateInfoPostDto } from './dto/updatePost.dto';
import { IsAuhtorGuard } from './guards/is-auhtor.guard';
import { PageAndIdPipe } from 'src/utils/pipes/page-and-id.pipe';
import { IPageAndId } from 'src/utils/interfaces/pageAndId.interface';

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
  @Get('user/:id/:page')
  async getUserPost(
    @Query('order', ParseIntPipe) querry: number,
    @Param(PageAndIdPipe) param: IPageAndId,
  ): Promise<any> {
    return this.postsService.getPostOfAnUser(param.id, param.page, querry);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('best/:id/:page')
  async getBestOfAnUser(@Param(PageAndIdPipe) param: IPageAndId): Promise<any> {
    return this.postsService.getBestOfAnUser(param.id, param.page);
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

  // ? para tomar posts por tag se usa el search con solo el tag
  @Put(':name')
  @UseGuards(IsAuhtorGuard)
  @HttpCode(HttpStatus.OK)
  async updateInfoPost(
    @Param() param: { name: string },
    @Body() body: UpdateInfoPostDto,
  ): Promise<ResponseWithMessage> {
    return await this.postsService.updateInfoPost(param.name, body);
  }

  @Delete(':name')
  @UseGuards(IsAuhtorGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param() param: { name: string },
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.postsService.deletePost(param.name, req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() body: CreatePostDto,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.postsService.createPost(body, req.user.id);
  }
}
