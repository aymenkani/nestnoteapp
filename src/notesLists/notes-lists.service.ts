import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NoteList, NoteListDocument } from './schemas/note-list.schema';
import { NoteListDto } from '../dto/note-list.dto';
import { Note } from 'src/notes/schemas/note.schema';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/enums/role.enum';
import { removeContributorDto } from 'src/dto/remove-contributor.dto';

@Injectable()
export class NotesListsService {
  constructor(
    @InjectModel(NoteList.name) private noteListModel: Model<NoteListDocument>,
  ) {}

  async create(noteListDto: NoteListDto): Promise<NoteList> {
    const createdNoteList = new this.noteListModel(noteListDto);
    return createdNoteList.save();
  }

  async findByName(name: string): Promise<NoteList> {
    return await this.noteListModel.findOne({ name });
  }

  async findOneById(id: string): Promise<NoteList> {
    return await this.noteListModel.findById(id);
  }

  async findAll(): Promise<NoteList[]> {
    return this.noteListModel.find().exec();
  }

  async addNote(note: Note, noteListId: string): Promise<NoteList> {
    const noteList = await this.findOneById(noteListId);
    if (!noteList) throw new BadRequestException('list not found!');

    const updatedNoteList = await this.noteListModel.findOneAndUpdate(
      { _id: noteListId },
      { $set: { notes: [...noteList.notes, note] } },
      { new: true },
    );

    return updatedNoteList;
  }

  async removeNote(noteId: string): Promise<boolean> {
    try {
      await this.noteListModel.findOneAndUpdate(
        { notes: [noteId] },
        { $pullAll: { notes: noteId } },
      );
    } catch (err) {
      throw new InternalServerErrorException('something went wrong');
    }

    return true;
  }

  async addContributorToNoteList(
    user: User,
    roles: Role[],
    noteListId: string,
  ): Promise<NoteList> {
    const noteList = await this.noteListModel.findOne({
      _id: noteListId,
    });
    if (!noteList) throw new BadRequestException(' list not found!');

    const isUserContributor = await this.noteListModel.findOne({
      _id: noteListId,
      'contributors.user': user,
    });

    if (isUserContributor)
      throw new BadRequestException('user is already a contributor');

    const updatedNoteList = await this.noteListModel.findOneAndUpdate(
      { _id: noteListId },
      { $set: { contributors: [...noteList.contributors, { user, roles }] } },
      { new: true },
    );

    return updatedNoteList;
  }

  async getNoteList(noteListId: string) {
    return await this.noteListModel.findById(noteListId);
  }
}
