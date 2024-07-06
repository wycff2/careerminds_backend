import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class createFeedbackDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  user: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  rating?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  reply: string;
}

export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class FeedbackUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;


  @IsNumber()
  @IsOptional()
  @ApiProperty()
  rating?: string;

  
  @IsString()
  @IsOptional()
  @ApiProperty()
  reply: string;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
