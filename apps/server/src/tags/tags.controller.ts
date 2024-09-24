import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { CreateTagDto } from './dto/createTag.dto';

@UseGuards(JwtGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createTag(
    @Req() req: UserRequest,
    @Body() body: CreateTagDto,
  ): Promise<ResponseWithMessage> {
    return this.tagsService.createTag(body, req.user.id);
  }
}
