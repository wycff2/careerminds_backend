import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';

enum statusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class createCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  Name?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  status: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  description: [string];
}

export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class CategoryUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  Name?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  status: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  description: [string];
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class UploadThumbnailDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: any;
}
