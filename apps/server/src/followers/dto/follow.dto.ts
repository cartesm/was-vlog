import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FollowDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsMongoId({ message: i18nValidationMessage('validation.INVALID_MONGO_ID') })
  user: Types.ObjectId;
}
