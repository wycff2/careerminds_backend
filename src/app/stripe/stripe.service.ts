import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { User } from '@app/models/user.schema';
import { StripePayment } from '@app/models/stripe.schema';
import { CreateStripeCustomerDto } from './stripe.dto';

interface SetupFutureUsage {
  usage: 'on_session' | 'off_session';
  save_payment_method: boolean;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(StripePayment.name) private stripePaymentModel: Model<StripePayment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  // async createPaymentIntent(model: { customer: any; amount: any; currency?: any; confirm?: any; metadata?: any }) {
  //   try {
  //     const originalAmount = Number(model.amount);
  //     // const taxAmount = originalAmount * 0.05; // 5% tax
  //     // const totalAmount = originalAmount + taxAmount;
  //     const paymentIntent = await this.stripe.paymentIntents.create({
  //       amount: originalAmount,
  //       currency: model.currency || 'USD',
  //       // "payment_method_types": ['card','paypal'] ||null,
  //       // "payment_method": model.payment_method||null,
  //       confirm: model.confirm || false,
  //       metadata: model.metadata || {},
  //       // receipt_email:'developer.mspl@gmail.com',
  //       // "capture_method": model.capture_method,
  //       // capture_method: 'manual',
  //       customer: model.customer,
  //       // application_fee_amount: (Number(model.amount) * 0.1).toFixed(0),
  //       // transfer_data: {
  //       //   destination: id,
  //       // }
  //     });

  //     // const payments = await new db.payments({
  //     //   amount: totalAmount,
  //     //   bookingId: model.metadata.classId,
  //     //   parentId: model.metadata.parentId,
  //     //   providerId: model.metadata.providerId,
  //     //   stripePaymentIntentId: paymentIntent.id,
  //     //   status: paymentIntent.status,
  //     // }).save();

  //     return paymentIntent;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createPaymentIntent(model: { customer: any; amount: any; currency?: any; confirm?: any; metadata?: any }) {
    try {
      const originalAmount = Number(model.amount);
      const minimumAmount = 50; // Set your minimum amount here or fetch it dynamically from Stripe documentation

      if (originalAmount < minimumAmount) {
        throw new HttpException(`The amount must be greater than or equal to ${minimumAmount}`, HttpStatus.BAD_REQUEST);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: originalAmount,
        currency: model.currency || 'usd',
        confirm: model.confirm || false,
        metadata: model.metadata || {},
        customer: model.customer,
      });

      return paymentIntent;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async updatePaymentIntent(paymentIntentId: string, model: { setup_future_usage?: SetupFutureUsage }) {
  //   try {
  //     const existingPaymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

  //     if (!existingPaymentIntent) {
  //       throw new HttpException(`Payment intent with id ${paymentIntentId} not found`, HttpStatus.NOT_FOUND);
  //     }

  //     let updateParams: Stripe.PaymentIntentUpdateParams = {};

  //     if (model.setup_future_usage) {
  //       const { setup_future_usage } = model;

  //       // Create an object that matches Stripe's expected type
  //       const emptyableSetupFutureUsage: Stripe.Emptyable<Stripe.PaymentIntentUpdateParams.SetupFutureUsage> = {
  //         setup_future_usage: {
  //           usage: setup_future_usage.usage,
  //           save_payment_method: setup_future_usage.save_payment_method,
  //         },
  //       };

  //       updateParams = emptyableSetupFutureUsage;
  //     }

  //     const updatedPaymentIntent = await this.stripe.paymentIntents.update(paymentIntentId, updateParams);

  //     return updatedPaymentIntent;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createCustomer(model: CreateStripeCustomerDto): Promise<string> {
    const { email, name, address, userId } = model;
    // console.log('Creating stripe customer with email:', email, 'and name:', name);
    let user = await this.userModel.findById(userId);
    if (!user) {
      console.error('Parent not found');
      throw new Error('Parent not found');
    }
    if (user.stripeId) {
      // console.log('User already has a stripe customer, returning stripe customer id:', user.stripeId);
      return user.stripeId;
    }
    // const paymentIntent = await stripe.customers.create(model);
    const customer = await this.stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        user: userId,
      },
      address: { line1: address },
    });
    if (customer && customer.id) {
      console.log('Created stripe customer with id:', customer.id);
      user.stripeId = customer.id;
      await user.save();
    }
    return customer.id;
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      Logger.error(error);
      throw new Error(`Stripe: ${error.message}`);
    }
  }
}
