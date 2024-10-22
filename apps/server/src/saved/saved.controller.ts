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
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { SavedPostDto } from './dto/savedPost.dto';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { Types } from 'mongoose';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { ParamId } from 'src/utils/interfaces/paramId.interface';

@UseGuards(JwtGuard)
@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async savePost(
    @Req() req: UserRequest,
    @Body() body: SavedPostDto,
  ): Promise<ResponseWithMessage> {
    return await this.savedService.savePost(req.user.id, body.postId);
  }

  @Get(':page')
  @HttpCode(HttpStatus.OK)
  async getSaves(
    @Param('page', ParseIntPipe) param: { page: number },
    @Req() req: UserRequest,
  ): Promise<any> {
    return await this.savedService.getAllSaved(req.user.id, param.page);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getYoursSaves(@Req() req: UserRequest): Promise<Types.ObjectId[]> {
    return await this.savedService.getSavesIds(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSaved(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.savedService.deleteSaved(req.user.id, param.id);
  }
}
