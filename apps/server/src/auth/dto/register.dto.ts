import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(27)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  img: string;

  @IsNotEmpty()
  @IsString()
  pass: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  descrption: string;
}
