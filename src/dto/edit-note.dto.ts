import { NoteDto } from './note.dto';

export class EditNoteDto {
  noteListId: string;
  noteId: string;
  changes: NoteDto;
}
