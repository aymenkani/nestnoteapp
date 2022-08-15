import { IsNotEmpty } from 'class-validator';

export class GetNoteListDto {
  @IsNotEmpty()
  noteListId: string;
}
