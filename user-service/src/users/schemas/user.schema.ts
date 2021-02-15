import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum Permissions {
  WRITE_TEXTS,
  EDIT_USERS,
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop({
    enum: Permissions,
    default: [Permissions.WRITE_TEXTS],
    type: [String],
  })
  claims: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
