import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

enum statusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export class createCourseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  Name?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  language: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  price?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  discount?: number;
}

export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class CourseUpdateDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  category: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  Name?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  price?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  language: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  discount?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  updated_at: Date;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
