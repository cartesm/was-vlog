import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EditUserDto {
  @IsString({ message: i18nValidationMessage('validaiton.INVALID_STRING') })
  password?: string;

  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(5, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(27, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  username?: string;

  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(150, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  description?: string;

  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(6, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(60, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  name?: string;

  @IsString({ message: i18nValidationMessage('validaiton.INVALID_STRING') })
  validationPass?: string;
}
