import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NoteList, NoteListDocument } from './schemas/note-list.schema';
import { NoteListDto } from '../dto/note-list.dto';

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
}
