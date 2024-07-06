import { Schema, SchemaFactory, Prop, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Course } from './course.schema';

@Schema()
export class Category {
  @Prop({ trim: true })
  Name?: string;

  @Prop({ enum: ['active', 'inactive'], required: false })
  status: string;

  @Prop({ required: false })
  description: [string];

  @Prop({ required: false, trim: true })
  thumbnail?: string;

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

export type CategorySchemaType = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.pre<Course>('save', function (next) {
  if (this.discount && this.price) {
    const discountedPrice = parseFloat(this.price) * (1 - this.discount / 100);
    this.offerPrice = discountedPrice.toFixed(2);
  }
  next();
});
