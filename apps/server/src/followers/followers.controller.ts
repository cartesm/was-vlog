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
import { FollowersService } from './followers.service';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { FollowDto } from './dto/follow.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { Types } from 'mongoose';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(JwtGuard)
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Public()
  @Get('fu/:page/:user')
  @HttpCode(HttpStatus.OK)
  async getFollowers(@Param() param: { page: number; user: Types.ObjectId }) {
    return await this.followersService.getFollowers(param.page, param.user);
  }

  @Get(':page')
  @HttpCode(HttpStatus.ACCEPTED)
  async getUserFollings(
    @Req() req: UserRequest,
    @Param('page', ParseIntPipe) param: number,
  ) {
    return await this.followersService.getUserFollings(param, req.user.id);
  }

  @Post('follow')
  @HttpCode(HttpStatus.CREATED)
  async followUser(
    @Body() body: FollowDto,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.followersService.followUser(body.user, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFollower(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.followersService.deleteFollower(req.user.id, param.id);
  }

  @Public()
  @Get('isFollow/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getIsFollow(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ) {
    console.log('pene');
    return await this.followersService.isFollow(
      param.id,
      req.user ? req.user.id : undefined,
    );
  }

  @Delete('unfollow/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowUser(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ): Promise<ResponseWithMessage> {
    return await this.followersService.unfollowUser(req.user.id, param.id);
  }
}
