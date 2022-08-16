import { IsNotEmpty } from 'class-validator';

export class DeleteNoteDto {
  @IsNotEmpty()
  noteListId: string;

  @IsNotEmpty()
  noteId: string;
}
