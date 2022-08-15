import { IsNotEmpty } from 'class-validator';

export class RemoveContributorDto {
  @IsNotEmpty()
  contributorId: string;

  @IsNotEmpty()
  noteListId: string;
}
