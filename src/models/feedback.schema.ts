import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Feedback {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: false })
  rating: number;

  @Prop({ required: false })
  reply: string;

  @Prop({
    required: false,
    trim: true,
  })
  avatar: string;

  @Prop(
    raw({
      platform: { type: String },
      os: { type: String },
      browser: { type: String },
      ip: { type: String },
    }),
  )
  metadata: Record<string, any>;

  @Prop({ required: false })
  token: string;

  @Prop({ required: false })
  otp: string;

  @Prop({ required: false })
  device_token: string;

  @Prop({ required: false, default: false })
  is_deleted: boolean;

  @Prop({ required: false, default: Date.now() })
  created_at: Date;

  @Prop({ required: false, default: Date.now() })
  updated_at: Date;
}

export type FeedbackSchemaType = HydratedDocument<Feedback>;

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
