import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

enum statusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESTRICTED = 'restricted',
}

export class createUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  role: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  phoneNumber: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  currentJobTitle: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  company: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  yearsOfExperience: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  about: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  fullName?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  about: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  phoneNumber: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  currentJobTitle?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  company?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  yearsOfExperience?: number;
}
export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class HeaderToken {
  @ApiProperty()
  ['x-access-token']: string;
}

export class LoginModel {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class AdminLoginModel {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  mode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  role: string;
}

export class LoginWithNumberOtpDto {
  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsString()
  contact_number: string;
}

// export class UserUpdateDto {
//   @IsString()
//   @IsOptional()
//   @ApiProperty()
//   Name?: string;

//   @IsNotEmpty()
//   @IsString()
//   @ApiProperty()
//   email: string;

//   @IsEnum(statusEnum)
//   @ApiProperty()
//   @IsOptional()
//   @IsString()
//   status: string;

//   @IsString()
//   @IsOptional()
//   @ApiProperty()
//   about: string;

//   @IsString()
//   @IsOptional()
//   @ApiProperty()
//   address: string;

//   @IsNumber()
//   @IsOptional()
//   @ApiProperty()
//   phoneNumber: number;
// }

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class loginwithEmailDto {
  @IsEmail()
  @ApiProperty({ description: 'custmor email address' })
  email: string;
}
export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}

export class ResetPasswordDto {
  @IsString()
  @ApiProperty()
  email?: string;

  @ApiProperty({ description: 'New password for the custmor' })
  @IsString()
  newPassword: string;
}

export class SetNewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  newPassword: string;
}

export class loginDto {
  email: string;
  password: string;
}
