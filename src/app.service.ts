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

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
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
}
