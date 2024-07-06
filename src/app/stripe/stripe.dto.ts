import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateStripePaymentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  orderId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  paymentIntentId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: false })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  currency: string;

  @IsString()
  @ApiProperty({ required: false, default: 'pending' })
  status?: string;
}

export class UpdateStripePaymentDto {
  @IsString()
  @ApiProperty({ required: false })
  paymentIntentId?: string;

  @IsNumber()
  @ApiProperty({ required: false })
  amount?: number;

  @IsString()
  @ApiProperty({ required: false })
  currency?: string;

  @IsString()
  @ApiProperty({ required: false })
  status?: string;
}

export class CreateStripeCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  address: string;
}
