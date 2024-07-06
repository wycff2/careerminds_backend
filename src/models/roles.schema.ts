import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
@Schema()
export class Role {
  @Prop()
  name: string;

  @Prop()
  display_name: string;

  @Prop()
  description: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {
      Dashboard: { read: true, write: true, delete: false },
      Management: { read: true, write: true, delete: false },
      Category: { read: true, write: true, delete: false },
      Module: { read: true, write: true, delete: false },
      Users: { read: true, write: true, delete: false },
      Enrollment: { read: true, write: true, delete: false },
      Participant: { read: true, write: true, delete: false },
      Feedback: { read: true, write: true, delete: false },
      'Admin User': { read: true, write: true, delete: false },
      'Access Control': { read: true, write: true, delete: false },
      'Audit Logs': { read: true, write: true, delete: false },
      Settings: { read: true, write: true, delete: false },
    },
  })
  admin_permissions: Record<string, { read: boolean; write: boolean; delete: boolean }>;

  @Prop(
    raw({
      platform: { type: String },
      os: { type: String },
      browser: { type: String },
      ip: { type: String },
    }),
  )
  metadata: Record<string, any>;

  @Prop({ required: false, default: false })
  is_activated: boolean;

  @Prop()
  note: string;

  @Prop()
  admin_note: string;

  @Prop({ required: false, default: false })
  is_deleted: boolean;

  @Prop({ required: false, default: Date.now() })
  created_at: Date;

  @Prop({ required: false, default: Date.now() })
  updated_at: Date;
}

export type RoleschemaType = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);
