import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Permissions } from '../enums/Permissions';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({
    enum: Permissions,
    type: [String],
    default: [Permissions.WRITE_TEXTS],
  })
  claims: string[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
