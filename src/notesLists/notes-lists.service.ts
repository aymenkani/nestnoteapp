import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NoteList, NoteListDocument } from './schemas/note-list.schema';
import { NoteListDto } from '../dto/note-list.dto';
import { Note } from 'src/notes/schemas/note.schema';
import { User } from 'src/users/schemas/user.schema';
import { Role } from 'src/enums/role.enum';

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
      { notes: [...noteList.notes, note] },
    );

    return updatedNoteList;
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
      { contributors: [...noteList.contributors, { user, roles }] },
    );

    return updatedNoteList;
  }

  async getNoteList(noteListId: string) {
    return await this.noteListModel.findById(noteListId);
  }
}
