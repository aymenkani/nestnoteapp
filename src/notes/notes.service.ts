import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { NoteDto } from '../dto/note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(noteDto: NoteDto): Promise<Note> {
    const createdNote = new this.noteModel(noteDto);
    return createdNote.save();
  }

  async findOneById(id: string): Promise<Note> {
    return await this.noteModel.findById(id);
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async editNote(noteId: string, changes: NoteDto): Promise<Note> {
    const existingNote = await this.noteModel.findById(noteId);
    if (!existingNote) throw new BadRequestException('note not found!');

    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: existingNote._id },
      { $set: changes },
      { new: true },
    );

    return updatedNote;
  }

  async deleteNote(noteId: string): Promise<boolean> {
    const existingNote = await this.noteModel.findById(noteId);
    if (!existingNote) throw new BadRequestException('note not found!');

    return await this.noteModel.findByIdAndRemove(noteId);
  }
}
