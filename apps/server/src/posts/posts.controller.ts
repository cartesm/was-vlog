import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { GetUserQuerryPipe } from './pipes/get-user-querry.pipe';

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
  @Get('/:user/:page')
  async getUserPost(
    @Query(GetUserQuerryPipe) querry: { page: number; order: number },
    @Req() req: UserRequest,
  ): Promise<any> {
    // TODO: refactor el pipe
    // TODO: continuar con el tomar posts del user
    return this.postsService.getPostOfAnUser(req.user.id, 1);
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
