import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';
import { EditUserDto } from './dto/editUserData.dto';
import { UserRequest } from 'src/auth/interfaces/userRequest.interface';
import { JwtGuard } from 'src/auth/guards/jwt-guard.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { ValidatePasswordGuard } from './guards/validatePassword.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExceptionsService } from 'src/utils/exceptions.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private exceptions: ExceptionsService,
  ) {}

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOneUser(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ) {
    return await this.usersService.getPublicUserData(param.id, req.user?.id);
  }

  @Get('private/:id')
  @HttpCode(HttpStatus.OK)
  async getPrivateUserData(
    @Param(ParseidPipe) param: ParamId,
    @Req() req: UserRequest,
  ) {
    if (req.user.id != param.id)
      this.exceptions.throwUnauthorized('auth.notMainUser');
    return await this.usersService.getPrivateUserData(param.id);
  }

  @Put('edit')
  @HttpCode(HttpStatus.OK)
  async editName(
    @Req() req: UserRequest,
    @Body() body: EditUserDto,
  ): Promise<ResponseWithMessage> {
    return await this.usersService.editProfileInfo(req.user.id, body);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('img'))
  @HttpCode(HttpStatus.OK)
  async uploadProfilePhoto(
    @Req() req: UserRequest,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ): Promise<ResponseWithMessage> {
    return await this.usersService.changeUserProfileImage(file, req.user.id);
  }
}
