import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateTagDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MinLength(3, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(15, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  name: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validaiton.INVALID_STRING') })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(150, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  description: string;
}
