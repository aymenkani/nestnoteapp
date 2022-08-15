import { IsNotEmpty } from 'class-validator';

export class DeleteNoteListDto {
  @IsNotEmpty()
  noteListId: string;
}
