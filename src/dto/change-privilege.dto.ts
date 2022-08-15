import { Role } from '../enums/role.enum';

export class ChangePrivilegeDto {
  noteListId: string;
  contributorId: string;
  roles: Role[];
}
