import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enums/role.enum';
import { Note } from 'src/notes/schemas/note.schema';

export type NoteListDocument = NoteList & Document;

@Schema()
export class NoteList {
  @Prop()
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }])
  notes: Note[];

  @Prop([
    raw({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: [Role] },
    }),
  ])
  contributors: Record<string, any>[];
}

export const NoteListSchema = SchemaFactory.createForClass(NoteList);
