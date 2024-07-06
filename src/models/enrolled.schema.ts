import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { Course } from './course.schema';

@Schema()
export class Enrolled {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: Course;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  paymentMethod?: string;

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

export type EnrolledSchemaType = HydratedDocument<Enrolled>;

export const EnrolledSchema = SchemaFactory.createForClass(Enrolled);
