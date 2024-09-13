import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ParamId } from 'src/utils/interfaces/paramId.interface';
import { ParseidPipe } from 'src/utils/pipes/parseid.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneUser(@Param(ParseidPipe) param: ParamId) {
    return 'pene';
  }
}
