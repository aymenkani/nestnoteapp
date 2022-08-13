import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Note } from 'src/notes/schemas/note.schema';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }])
  Notes: Note[];
}

export const UserSchema = SchemaFactory.createForClass(User);
