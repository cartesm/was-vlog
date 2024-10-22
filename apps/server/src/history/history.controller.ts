import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { AddHistoryItemDto } from './dto/addHistoryItem.dto';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { Types } from 'mongoose';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async addItemToHistory(
    @Body() body: AddHistoryItemDto,
    @Req() req: UserRequest,
  ): Promise<void> {
    return await this.historyService.addPostToHistory(req.user.id, body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHistory(
    @Req() req: UserRequest,
  ): Promise<{ history: Types.ObjectId[] }> {
    return await this.historyService.getHistory(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItemFromHistory(
    @Req() req: UserRequest,
    @Param(ParseidPipe) param: ParamId,
  ): Promise<ResponseWithMessage> {
    return await this.historyService.deleteItemOfHistory(req.user.id, param.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteHistory(@Req() req: UserRequest): Promise<ResponseWithMessage> {
    return this.historyService.deleteAllHistory(req.user.id);
  }
}
