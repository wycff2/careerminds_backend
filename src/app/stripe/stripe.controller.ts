import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Put } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateStripeCustomerDto } from './stripe.dto';

@Controller('stripe')
@ApiTags('Stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/create-payment-intent')
  async createPaymentIntent(@Body() model: any) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(model);
      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/payment-intent/:paymentIntentId')
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.getPaymentIntent(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Put('/payment-intent/:paymentIntentId')
  // async updatePaymentIntent(@Param('paymentIntentId') paymentIntentId: string, @Body() model: any) {
  //   try {
  //     const paymentIntent = await this.stripeService.updatePaymentIntent(paymentIntentId, model);
  //     return paymentIntent;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Post('/confirm-payment-intent')
  async confirmPaymentIntent(@Body('paymentIntentId') paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripeService.confirmPaymentIntent(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
