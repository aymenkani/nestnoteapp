import { Role } from 'src/enums/role.enum';
import { IsArray, IsNotEmpty, ArrayUnique } from 'class-validator';

export class InviteUserDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayUnique()
  roles: Role[];

  @IsNotEmpty()
  noteListId: string;
}
