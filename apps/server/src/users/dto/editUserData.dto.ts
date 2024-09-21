import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EditNameDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(6, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(60, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  name: string;
}

export class EditDescriptionDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(150, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  description: string;
}

export class ChangeUserNameDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.REQUIRED'),
  })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(5, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(27, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  username: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validaiton.INVALID_STRING') })
  password: string;
}
