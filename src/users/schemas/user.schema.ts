import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { NoteList } from 'src/notesLists/schemas/note-list.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }])
  NoteLists?: NoteList[];
}

export const UserSchema = SchemaFactory.createForClass(User);
