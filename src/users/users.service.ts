import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { NoteList } from 'src/notesLists/schemas/note-list.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: UserDto): Promise<User> {
    const hashedPwd = await bcrypt.hash(userDto.password, 10);

    const createdUser = new this.userModel({
      email: userDto.email,
      password: hashedPwd,
    });
    return await createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async addNoteList(noteList: NoteList, userId: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { noteLists: noteList._id },
      },
      { new: true },
    );
  }

  async removeNoteList(noteListId: string, userId: string): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { noteLists: noteListId },
        },
        { new: true },
      )
      .populate('noteLists');
  }

  async findUserNoteLists(userId: string) {
    return await this.userModel.findById(userId).populate('noteLists');
  }
}
