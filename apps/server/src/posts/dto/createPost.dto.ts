import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  maxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PostItemEnum, PostSubItemEnum } from '../enums/posts.enum';
import { Type } from 'class-transformer';
import { isValidObjectId, Types } from 'mongoose';
import { LanguajeEnum } from 'src/utils/enums/languaje.enums';

class ContentSubItemConfigs {
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validaiton.INVALID_NUMBER') })
  @Min(0)
  @Max(10000)
  width?: number;

  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validaiton.INVALID_NUMBER') })
  @Min(0)
  @Max(10000)
  height?: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsUrl({}, { message: i18nValidationMessage('validation.INVALID_URL') })
  url?: string;
}

class ContentSubItem {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEnum(PostSubItemEnum, {
    message: i18nValidationMessage('validation.NOT_IN_LIST'),
  })
  type: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  value: string;

  @IsOptional()
  @ValidateNested({
    message: i18nValidationMessage('validation.INVALID_NESTED'),
  })
  @Type(() => ContentSubItemConfigs)
  configs?: ContentSubItemConfigs;
}

class ContentItem {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEnum(PostItemEnum, {
    message: i18nValidationMessage('validation.NOT_IN_LIST'),
  })
  type: string;

  @IsNotEmpty()
  @IsArray({ message: i18nValidationMessage('validation.INVALID_ARRAY') })
  @ArrayMaxSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_LENGTH'),
  })
  @ValidateNested({
    message: i18nValidationMessage('validation.INVALID_NESTED'),
  })
  @Type(() => ContentSubItem)
  content: ContentSubItem[];
}

export class CreatePostDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(150, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  name: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LNEGTH') })
  @MaxLength(200, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  description: string;

  @IsOptional()
  @IsMongoId({
    each: true,
    message: i18nValidationMessage('validation.INVALID_MONGO_ID'),
  })
  @IsArray({ message: i18nValidationMessage('validation.INVALID_ARRAY') })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_LEGHT'),
  })
  @Type(() => Types.ObjectId)
  tags: [Types.ObjectId];

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEnum(LanguajeEnum, {
    message: i18nValidationMessage('validation.NOT_IN_LIST'),
  })
  languaje: String;

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsArray({ message: i18nValidationMessage('validation.INVALID_ARRAY') })
  @ArrayMinSize(1, {
    message: i18nValidationMessage('validation.ARRAY_MIN_LENGTH'),
  })
  @ValidateNested({
    message: i18nValidationMessage('validation.INVALID_NESTED'),
  })
  @Type(() => ContentItem)
  content: [ContentItem];
}
