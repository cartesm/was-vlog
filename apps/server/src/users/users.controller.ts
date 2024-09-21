import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import {
  ChangePasswordDto,
  ChangeUserNameDto,
  EditDescriptionDto,
  EditNameDto,
} from './dto/editUserData.dto';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { ValidatePasswordGuard } from './guards/validatePassword.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async getOneUser(@Param(ParseidPipe) param: ParamId) {
    return await this.usersService.getPublicUserData(param.id);
  }

  @Patch('name')
  @HttpCode(HttpStatus.OK)
  async editName(
    @Req() req: UserRequest,
    @Body() body: EditNameDto,
  ): Promise<ResponseWithMessage> {
    return await this.usersService.editName(req.user.id, body.name);
  }

  @Patch('description')
  @HttpCode(HttpStatus.OK)
  async editDescription(
    @Req() req: UserRequest,
    @Body() body: EditDescriptionDto,
  ): Promise<ResponseWithMessage> {
    return this.usersService.editDescription(req.user.id, body.description);
  }

  @Patch('username')
  @UseGuards(ValidatePasswordGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async changeUsername(
    @Req() req: UserRequest,
    @Body() body: ChangeUserNameDto,
  ): Promise<ResponseWithMessage> {
    return await this.usersService.changeUsername(req.user.id, body.username);
  }

  @Patch('password')
  @UseGuards(ValidatePasswordGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async changePassword(
    @Req() req: UserRequest,
    @Body() body: ChangePasswordDto,
  ): Promise<ResponseWithMessage> {
    return this.usersService.changePassword(req.user.id, body.password);
  }
}
