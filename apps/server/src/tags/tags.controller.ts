import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ImATeapotException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CreateTagDto } from './dto/createTag.dto';
import { UpdateTagPipe } from './pipes/update.pipe';
import { SearchTagPipe } from './pipes/search-tag.pipe';
import { TagsType } from './schemas/tag.schema';
import { SearchQuerryPipePipe } from './pipes/search-querry-pipe.pipe';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get('s/:page')
  @HttpCode(HttpStatus.OK)
  async searchTags(
    @Param(SearchTagPipe) param: number,
    @Query(SearchQuerryPipePipe) query: { value: string; orderBy: number },
  ) {
    return await this.tagsService.searchTag(param, query.value, query.orderBy);
  }

  @Public()
  @Get(':tagName')
  @HttpCode(HttpStatus.OK)
  async getTag(@Param() param: { tagName: string }): Promise<TagsType> {
    return await this.tagsService.getTag(param.tagName);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @Req() req: UserRequest,
    @Body() body: CreateTagDto,
  ): Promise<ResponseWithMessage> {
    return this.tagsService.createTag(body, req.user.id);
  }

  @Put(':name')
  @HttpCode(HttpStatus.OK)
  async updateTag(
    @Body() body: CreateTagDto,
    @Param(UpdateTagPipe) param: string,
  ): Promise<ResponseWithMessage> {
    return await this.tagsService.updateTag(param, body);
  }
}
