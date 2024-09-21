import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { I18nContext, i18nValidationMessage } from 'nestjs-i18n';
export class RegisterDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.REQUIRED'),
  })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(5, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(27, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(6, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(60, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  name: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.REQUIRED'),
  })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validaiton.INVALID_STRING') })
  @IsUrl({}, { message: i18nValidationMessage('validation.INVALID_URL') })
  img: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  pass: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(250, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  descrption: string;
}
