import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
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
import { JwtPayload } from './auth/jwt-strategy';
import { Role } from './enums/role.enum';
import { AddNoteToListDto } from './dto/add-note-to-list.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { GetNoteListDto } from './dto/get-note-list.dto';

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private notesListsService: NotesListsService,
    private NoteService: NotesService,
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

  async createList(newNoteList: NoteListDto, user: any): Promise<NoteList> {
    const noteList = await this.notesListsService.findByName(newNoteList.name);
    if (noteList)
      throw new BadRequestException(
        'you cannot have more than one list with the same name',
      );

    const existingUser = await this.usersService.findOneById(user.userId);

    const createdNoteList = await this.notesListsService.create({
      ...newNoteList,
      contributors: [{ user: existingUser, roles: [Role.Owner] }],
    });

    await this.usersService.update(
      { noteLists: [...existingUser.noteLists, createdNoteList] },
      user.userId,
    );

    return createdNoteList;
  }

  async addNoteToList(addNoteToListDto: AddNoteToListDto, userId: string) {
    const creator = await this.usersService.findOneById(userId);

    if (!creator) throw new UnauthorizedException();

    const note = await this.NoteService.create({
      ...addNoteToListDto.note,
      creator,
    });

    const updatedNoteList = await this.notesListsService.addNote(
      note,
      addNoteToListDto.noteListId,
    );

    return updatedNoteList;
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

  async getNoteList(getNoteListDto: GetNoteListDto) {
    return await this.notesListsService.getNoteList(getNoteListDto.noteListId);
  }
}
