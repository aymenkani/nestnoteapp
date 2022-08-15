import { NoteDto } from './note.dto';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class EditNoteDto {
  @IsNotEmpty()
  noteListId: string;

  @IsNotEmpty()
  noteId: string;

  @IsNotEmptyObject()
  changes: NoteDto;
}
