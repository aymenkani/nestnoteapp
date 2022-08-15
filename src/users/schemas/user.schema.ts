import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { NoteList } from 'src/notesLists/schemas/note-list.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
    },
  },
})
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }])
  noteLists?: NoteList[];
}

export const UserSchema = SchemaFactory.createForClass(User);
