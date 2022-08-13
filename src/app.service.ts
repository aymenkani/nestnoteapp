import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './users/schemas/user.schema';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}

  async signup(userDto: UserDto): Promise<User> {
    const user = await this.usersService.findOneByEmail(userDto.email);
    if (!user) throw new UnauthorizedException();

    return await this.usersService.create(userDto);
  }
}
