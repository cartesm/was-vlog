import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCommentDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  content: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsMongoId({ message: i18nValidationMessage('validation.INVALID_MONGO_ID') })
  post: Types.ObjectId;

  @IsOptional()
  @IsMongoId({ message: i18nValidationMessage('validation.INVALID_MONGO_ID') })
  respondTo?: Types.ObjectId;
}
