import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async login(@Body() userDto: UserDto) {
    return await this.appService.login(userDto);
  }

  @Post()
  async singup(@Body() userDto: UserDto) {
    return await this.appService.signup(userDto);
  }
}
