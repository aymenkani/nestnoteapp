import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Session,
  SetMetadata,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { AddNoteToListDto } from './dto/add-note-to-list.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { NoteListDto } from './dto/note-list.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './enums/role.enum';

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

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async inviteUser(@Body() inviteUserDto: InviteUserDto) {
    return await this.appService.inviteUser(inviteUserDto);
  }
}
