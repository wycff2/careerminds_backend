import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class createEnrolledDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  user: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  course: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  paymentMethod?: string;

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

export class EnrolledUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  paymentMethod?: string;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
