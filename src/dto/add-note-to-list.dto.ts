import { NoteDto } from './note.dto';

export class AddNoteToListDto {
  note: NoteDto;
  noteListId: string;
}
