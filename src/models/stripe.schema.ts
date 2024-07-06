import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Orders } from './order.schema';

@Schema()
export class StripePayment {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Orders' })
  orderId: Orders;

  @Prop({ required: false })
  paymentIntentId: string;

  @Prop({ required: false })
  amount: number;

  @Prop({ required: false })
  currency: string;

  @Prop({ required: false, default: 'pending' })
  status: string;

  @Prop({ required: false, default: Date.now })
  created_at: Date;

  @Prop({ required: false, default: Date.now })
  updated_at: Date;
}

export type StripePaymentDocument = HydratedDocument<StripePayment>;

export const StripePaymentSchema = SchemaFactory.createForClass(StripePayment);
