import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

@Schema()
export class Course {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ trim: true })
  Name?: string;

  @Prop({ enum: ['active', 'inactive'], required: false })
  status: string;

  @Prop({ trim: true, required: false })
  description: string;

  @Prop({ required: false })
  price?: string;

  @Prop({ required: false })
  offerPrice?: string;

  @Prop({ required: false })
  discount?: number;

  @Prop({ required: false })
  language: string;

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
  device_token: string;

  @Prop({ required: false, default: false })
  is_deleted: boolean;

  @Prop({ required: false, default: Date.now() })
  created_at: Date;

  @Prop({ required: false, default: Date.now() })
  updated_at: Date;
}

export type CourseSchemaType = HydratedDocument<Course>;

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.pre<Course>('save', function (next) {
  if (this.discount && this.price) {
    const discountedPrice = parseFloat(this.price) * (1 - this.discount / 100);
    this.offerPrice = discountedPrice.toFixed(2);
  }
  next();
});
