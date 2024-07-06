import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

enum statusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESTRICTED = 'restricted',
}

export class createParticipantsDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  user: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  status: string;
}

export class PagingQueryDto {
  @ApiProperty()
  page_no: number;
  @ApiProperty()
  page_size: number;
}

export class ParticipantsUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsEnum(statusEnum)
  @ApiProperty()
  @IsString()
  status: string;
}

export class fileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
