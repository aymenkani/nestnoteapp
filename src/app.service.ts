import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './users/schemas/user.schema';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NoteListDto } from './dto/note-list.dto';
import { NoteList } from './notesLists/schemas/note-list.schema';
import { NotesListsService } from './notesLists/notes-lists.service';
import { NotesService } from './notes/notes.service';
import { Role } from './enums/role.enum';
import { AddNoteToListDto } from './dto/add-note-to-list.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { GetNoteListDto } from './dto/get-note-list.dto';
import { EditNoteDto } from './dto/edit-note.dto';
import { DeleteNoteDto } from './dto/delete-note.dto';
import { RemoveContributorDto } from './dto/remove-contributor.dto';
import { ChangePrivilegeDto } from './dto/change-privilege.dto';
import { DeleteNoteListDto } from './dto/delete-notelist.dto';

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private notesListsService: NotesListsService,
    private noteService: NotesService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(userDto: UserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (user) throw new BadRequestException('email already exist');

    return await this.usersService.create(userDto);
  }

  async login(userDto: UserDto): Promise<{ jwt: string }> {
    const { email, password } = userDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Wrong credentials!');

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) throw new BadRequestException('Wrong credentials!');

    return { jwt: this.jwtService.sign({ email, sub: user._id }) };
  }

  async createList(
    newNoteList: NoteListDto,
    userId: string,
  ): Promise<NoteList> {
    const noteList = await this.notesListsService.findByName(newNoteList.name);
    if (noteList)
      throw new BadRequestException(
        'you cannot have more than one list with the same name',
      );

    const existingUser = await this.usersService.findOneById(userId);

    const createdNoteList = await this.notesListsService.create({
      ...newNoteList,
      contributors: [{ user: existingUser, roles: [Role.Owner] }],
    });

    try {
      await this.usersService.addNoteList(createdNoteList, userId);
    } catch (err) {
      throw new InternalServerErrorException();
    }

    return createdNoteList;
  }

  async addNoteToList(addNoteToListDto: AddNoteToListDto, userId: string) {
    const creator = await this.usersService.findOneById(userId);

    if (!creator) throw new UnauthorizedException();

    const note = await this.noteService.create({
      ...addNoteToListDto.note,
      creator,
    });

    const updatedNoteList = await this.notesListsService.addNote(
      note,
      addNoteToListDto.noteListId,
    );

    return updatedNoteList;
  }

  async editNote(editNoteDto: EditNoteDto) {
    return await this.noteService.editNote(
      editNoteDto.noteId,
      editNoteDto.changes,
    );
  }

  async getAllNoteLists(userId: string) {
    return await this.usersService.findUserNoteLists(userId);
  }

  async changeNoteListName(noteListId: string, noteListName: string) {
    return await this.notesListsService.changeNoteListName(
      noteListName,
      noteListId,
    );
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto) {
    const noteExistInList = await this.notesListsService.getNote(
      deleteNoteDto.noteId,
      deleteNoteDto.noteListId,
    );

    if (!noteExistInList) throw new NotFoundException('note not found in list');

    await this.noteService.deleteNote(deleteNoteDto.noteId);
    await this.notesListsService.removeNote(
      deleteNoteDto.noteId,
      deleteNoteDto.noteListId,
    );

    return true;
  }

  async deleteNoteList(deleteNoteListDto: DeleteNoteListDto, userId: string) {
    let user = await this.usersService.findOneById(userId);
    if (!user) throw new UnauthorizedException();

    try {
      await this.notesListsService.deleteNoteList(deleteNoteListDto);
      user = await this.usersService.removeNoteList(
        deleteNoteListDto.noteListId,
        userId,
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async inviteUser(inviteUserDto: InviteUserDto) {
    const user = await this.usersService.findOneById(inviteUserDto.userId);
    if (!user) throw new UnauthorizedException();

    return await this.notesListsService.addContributorToNoteList(
      user,
      inviteUserDto.roles,
      inviteUserDto.noteListId,
    );
  }

  async removeContributor(removeContributorDto: RemoveContributorDto) {
    return await this.notesListsService.removeContributor(removeContributorDto);
  }

  async changePrivilege(changePrivilegeDto: ChangePrivilegeDto) {
    return await this.notesListsService.changePrivilege(changePrivilegeDto);
  }

  async getNoteList(getNoteListDto: GetNoteListDto) {
    return await this.notesListsService.getNoteList(getNoteListDto.noteListId);
  }
}
