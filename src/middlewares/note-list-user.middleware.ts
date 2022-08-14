import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role } from 'src/enums/role.enum';
import { NotesListsService } from 'src/notesLists/notes-lists.service';
import { User } from 'src/users/schemas/user.schema';

/**
 * search for a user inside the notelist's contributors property and inject it in the request as req.user.
 */
@Injectable()
export class NoteListUserMiddleware implements NestMiddleware {
  constructor(private notesListsService: NotesListsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { noteListId, userId } = req.body;

    const noteList = await this.notesListsService.findOneById(noteListId);
    if (!noteList) return next();

    const user = noteList.contributors?.find(
      (userObj) => userObj.user === userId,
    );

    if (!user) return next();

    req.user = user as { user: User; roles: Role[] };

    next();
  }
}
