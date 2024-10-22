import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryResponse } from './types/cloudinaryResponde.type';
import { v2 as cloudinary } from 'cloudinary';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';
const streamifier = require('streamifier');
@Injectable()
export class CloudinaryService {
  constructor(private i18n: I18nService) {}

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(image: string): Promise<ResponseWithMessage> {
    try {
      await cloudinary.uploader.destroy(image);

      return {
        message: this.i18n.t('test.cloudinary.deleteSuccess', {
          lang: I18nContext.current().lang,
        }),
      };
    } catch ({ message }) {
      throw new InternalServerErrorException(
        this.i18n.t('test.cloudinary.deleteFailure', {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }
}
