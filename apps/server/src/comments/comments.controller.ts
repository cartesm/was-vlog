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
import { CommentsService } from './comments.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { Types } from 'mongoose';
import { OrderQueryPipe } from './pipes/order-query.pipe';
import { CreateCommentDto } from './dto/create.comment.dto';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { ValidateUserGuard } from './guards/validate-user.guard';
import { UpdateCommentDto } from './dto/update.comment.dto';
import { PageAndIdPipe } from 'src/utils/pipes/page-and-id.pipe';
import { IPageAndId } from 'src/utils/interfaces/pageAndId.interface';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // se usa esta ruta para los comentarios nomales y sus respuestas
  @Public()
  @Get(':id/:page')
  @HttpCode(HttpStatus.OK)
  async getComments(
    @Param(PageAndIdPipe)
    param: IPageAndId,
    @Query(OrderQueryPipe) query: { order: number; respond: Types.ObjectId },
  ): Promise<any> {
    return await this.commentsService.getComments(
      param.id,
      param.page,
      query.order,
      query.respond,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Req() req: UserRequest,
    @Body() body: CreateCommentDto,
  ): Promise<any> {
    return await this.commentsService.createComment(req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(ValidateUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ): Promise<any> {
    return await this.commentsService.deleteComment(param.id, req.user.id);
  }

  @Get(':page')
  @HttpCode(HttpStatus.OK)
  async getCommentsOfAnUser(
    @Param('page', ParseIntPipe) param: { page: number },
    @Query(OrderQueryPipe) query: { order: number },
    @Req() req: UserRequest,
  ) {
    return await this.commentsService.getAllCommentOfAnUser(
      req.user.id,
      param.page,
      query.order,
    );
  }

  @Put(':id')
  @UseGuards(ValidateUserGuard)
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Body() body: UpdateCommentDto,
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ): Promise<any> {
    return await this.commentsService.updatedComment(
      param.id,
      req.user.id,
      body,
    );
  }
}
