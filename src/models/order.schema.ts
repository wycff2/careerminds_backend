import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema()
export class Orders {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  userId: User;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course', required: false })
  courseIds: Course[];

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  customerId?: string;

  @Prop({ trim: true, required: false })
  paymentId?: string;

  @Prop({ required: false, default: 0 })
  totalAmount: number;

  @Prop({ required: false, default: false })
  is_deleted: boolean;

  @Prop({ required: false, default: Date.now })
  created_at: Date;

  @Prop({ required: false, default: Date.now })
  updated_at: Date;
}

export type OrdersSchemaType = HydratedDocument<Orders>;

export const OrdersSchema = SchemaFactory.createForClass(Orders);
