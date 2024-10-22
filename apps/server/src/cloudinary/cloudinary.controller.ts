import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { DeletePipe } from './pipes/delete.pipe';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private i18n: I18nService,
  ) {}

  @Post('img')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('img'))
  async uploadImage(
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
  ): Promise<ResponseWithMessage> {
    const respCloudinary = await this.cloudinaryService.uploadFile(file);

    return {
      message: this.i18n.t('test.cloudinary.imgSuccess', {
        lang: I18nContext.current().lang,
      }),
      data: respCloudinary.url,
    };
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(
    @Param(DeletePipe) param: string,
  ): Promise<ResponseWithMessage> {
    return await this.cloudinaryService.deleteImage(param);
  }
}
