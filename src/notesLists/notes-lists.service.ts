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
import { RemoveContributorDto } from 'src/dto/remove-contributor.dto';
import { ChangePrivilegeDto } from 'src/dto/change-privilege.dto';
import { DeleteNoteListDto } from 'src/dto/delete-notelist.dto';

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
      { $push: { notes: note } },
      { new: true },
    );

    return updatedNoteList;
  }

  async removeNote(noteId: string, noteListId: string): Promise<boolean> {
    try {
      await this.noteListModel.findOneAndUpdate(
        { _id: noteListId },
        { $pull: { notes: noteId } },
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

  async removeContributor(
    removeContributorDto: RemoveContributorDto,
  ): Promise<NoteList> {
    return await this.noteListModel.findOneAndUpdate(
      {
        _id: removeContributorDto.noteListId,
      },
      {
        $pull: {
          contributors: {
            user: removeContributorDto.contributorId,
          },
        },
      },
      { new: true },
    );
  }

  async getNoteList(noteListId: string): Promise<NoteList> {
    return await this.noteListModel.findById(noteListId).populate('notes');
  }

  async deleteNoteList(deleteNoteListDto: DeleteNoteListDto): Promise<boolean> {
    return await this.noteListModel.findByIdAndRemove(
      deleteNoteListDto.noteListId,
    );
  }

  async getNote(noteId: string, noteListId: string) {
    const noteList = await this.getNoteList(noteListId);

    return noteList.notes.find((note) => note._id.toString() === noteId);
  }

  async changePrivilege(changePrivilegeDto: ChangePrivilegeDto) {
    return await this.noteListModel.findOneAndUpdate(
      { _id: changePrivilegeDto.noteListId },
      {
        $set: { 'contributors.$[element].roles': changePrivilegeDto.roles },
      },
      {
        arrayFilters: [{ 'element.user': changePrivilegeDto.contributorId }],
        new: true,
      },
    );
  }
}
