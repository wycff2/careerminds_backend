import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class createOrdersDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userId: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  courseIds: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}

export class OrdersUpdateDto {
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
