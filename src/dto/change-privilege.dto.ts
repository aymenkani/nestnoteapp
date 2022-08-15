import { Role } from '../enums/role.enum';
import { IsNotEmpty, IsArray, ArrayUnique } from 'class-validator';

export class ChangePrivilegeDto {
  @IsNotEmpty()
  noteListId: string;

  @IsNotEmpty()
  contributorId: string;

  @IsArray()
  @ArrayUnique()
  roles: Role[];
}
