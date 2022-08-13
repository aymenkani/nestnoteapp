import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesListsService } from './notes-lists.service';
import { NoteList, NoteListSchema } from './schemas/note-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteList.name, schema: NoteListSchema },
    ]),
  ],
  controllers: [],
  providers: [NotesListsService],
})
export class NotesModule {}
