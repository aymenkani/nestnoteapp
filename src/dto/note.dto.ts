import { User } from 'src/users/schemas/user.schema';
import { MinLength } from 'class-validator';

export class NoteDto {
  @MinLength(2)
  title: string;

  @MinLength(5)
  discription?: string;

  creator?: User;
}
