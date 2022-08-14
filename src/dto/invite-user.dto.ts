import { Role } from 'src/enums/role.enum';

export class InviteUserDto {
  userId: string;
  roles: Role[];
  noteListId: string;
}
