import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsDateString } from 'class-validator';

enum statusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class createCourseModuleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  course: string;

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

export class CourseModuleUpdateDto {
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

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  updated_at: Date;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class UpdateFilePathDto {
  @IsString()
  @ApiProperty()
  filePath: string;
}

export class UploadVideoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  video: any;
}

export class UploadThumbnailDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: any;
}
