import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
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

    const { noteListId, roles } = request.body;

    // if roles exist in body then check if roles types equal to enum Role
    if (roles) {
      const sameType = Object.values(Role).some((role) => roles.includes(role));
      if (!sameType)
        throw new BadRequestException(
          'roles must contain one or more of these values:  ' +
            Object.values(Role),
        );
    }

    const noteList = await this.notesListsService.findOneById(noteListId);

    if (!noteList) throw new BadRequestException('noteList not found!');

    const noteListUser = noteList.contributors?.find(
      (userObj) => userObj.user.toString() === request.user?.userId,
    );

    if (!noteListUser) return false;

    return requiredRoles.some((role) => noteListUser.roles?.includes(role));
  }
}
