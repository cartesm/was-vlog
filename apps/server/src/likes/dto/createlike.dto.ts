import { IsMongoId, isMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateLikeDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsMongoId({ message: i18nValidationMessage('validation.INVALID_MONGO_ID') })
  id: Types.ObjectId;
}
