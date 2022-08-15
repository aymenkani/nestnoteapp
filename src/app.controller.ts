import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { AddNoteToListDto } from './dto/add-note-to-list.dto';
import { DeleteNoteDto } from './dto/delete-note.dto';
import { EditNoteDto } from './dto/edit-note.dto';
import { GetNoteListDto } from './dto/get-note-list.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { NoteListDto } from './dto/note-list.dto';
import { RemoveContributorDto } from './dto/remove-contributor.dto';
import { ChangePrivilegeDto } from './dto/change-privilege.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';
import { DeleteNoteListDto } from './dto/delete-notelist.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    const { jwt } = await this.appService.login(userDto);

    return jwt;
  }

  @Post('signup')
  async signup(@Body() userDto: UserDto) {
    return await this.appService.signup(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-list')
  async createList(@Body() newNoteList: NoteListDto, @Req() req) {
    return await this.appService.createList(newNoteList, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add-note')
  @Roles(Role.Owner, Role.Write)
  async addNoteToList(@Body() addNoteToListDto: AddNoteToListDto, @Req() req) {
    return await this.appService.addNoteToList(
      addNoteToListDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('invite')
  @Roles(Role.Owner)
  async inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return await this.appService.inviteUser(inviteUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('edit-note')
  @Roles(Role.Owner, Role.Write)
  async editNote(@Body() editNoteDto: EditNoteDto) {
    await this.appService.editNote(editNoteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('delete-note')
  @Roles(Role.Owner, Role.Write)
  async deleteNote(@Body() deleteNoteDto: DeleteNoteDto) {
    return await this.appService.deleteNote(deleteNoteDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('get-notelist')
  @Roles(Role.Owner, Role.Read)
  async getNoteList(@Body() getNoteListDto: GetNoteListDto) {
    return await this.appService.getNoteList(getNoteListDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('delete-notelist')
  @Roles(Role.Owner)
  async deleteNoteList(@Body() deleteNoteListDto: DeleteNoteListDto) {
    return await this.appService.deleteNoteList(deleteNoteListDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('remove-contributor')
  @Roles(Role.Owner)
  async removeContributor(@Body() removeContributorDto: RemoveContributorDto) {
    return await this.appService.removeContributor(removeContributorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('change-privilege')
  @Roles(Role.Owner)
  async changePrivilege(@Body() changePrivilegeDto: ChangePrivilegeDto) {
    return await this.appService.changePrivilege(changePrivilegeDto);
  }
}
