import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class createCartsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [String], required: false })
  courseId: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}

export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class CartsUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
