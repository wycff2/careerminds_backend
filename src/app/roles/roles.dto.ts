import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class createRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  note: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  admin_note: string;

  @ApiProperty()
  @IsOptional()
  admin_permissions?: Record<string, { read: boolean; write: boolean; delete: boolean }>;
}

export class PagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}
export class RoleUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  display_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  admin_note?: string;

  @IsOptional()
  @ApiProperty()
  is_activated?: boolean;

  @ApiProperty()
  @IsOptional()
  admin_permissions?: Record<string, { read: boolean; write: boolean; delete: boolean }>;
}
