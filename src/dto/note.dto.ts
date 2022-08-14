import { User } from 'src/users/schemas/user.schema';

export class NoteDto {
  title: string;

  discription?: string;

  creator?: User;
}
