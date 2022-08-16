import { Role } from 'src/enums/role.enum';
import { Note } from 'src/notes/schemas/note.schema';
import { User } from 'src/users/schemas/user.schema';
import { MinLength } from 'class-validator';

export class NoteListDto {
  @MinLength(2)
  name: string;

  contributors?: { user: User; roles: Role[] }[];

  notes?: Note[];
}
