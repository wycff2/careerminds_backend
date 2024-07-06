import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from './roles.schema';

@Schema()
export class User {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ trim: true, required: false })
  fullName: string;

  @Prop({ trim: true, required: false })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  phoneNumber: number;

  @Prop({ trim: true, required: false })
  currentJobTitle: string;

  @Prop({ trim: true, required: false })
  company: string;

  @Prop({ required: false })
  yearsOfExperience: number;

  @Prop({ required: false })
  about: string;

  @Prop({ required: false })
  address: string;

  @Prop({ enum: ['active', 'inactive', 'restricted'], required: false })
  status: string;

  @Prop({ trim: true, required: false })
  uniqueId: string;

  @Prop()
  stripeId: string;

  @Prop({
    required: false,
    trim: true,
  })
  avatar: string;

  @Prop({ required: false })
  lastLogin: Date;

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

export type UserSchemaType = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
