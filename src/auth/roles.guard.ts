import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/role.enum';
import { NotesListsService } from 'src/notesLists/notes-lists.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private notesListsService: NotesListsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const { noteListId } = request.body;

    const noteList = await this.notesListsService.findOneById(noteListId);

    const noteListUser = noteList.contributors?.find(
      (userObj) => userObj.user.toString() === request.user?.userId,
    );

    if (!noteListUser) return false;

    return requiredRoles.some((role) => noteListUser.roles?.includes(role));
  }
}
