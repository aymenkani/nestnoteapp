import { NoteDto } from './note.dto';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class AddNoteToListDto {
  @IsNotEmptyObject()
  note: NoteDto;

  @IsNotEmpty()
  noteListId: string;
}
