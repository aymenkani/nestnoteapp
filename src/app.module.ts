import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { NotesService } from './notes/notes.service';
import { NotesListsModule } from './notesLists/notes-lists.module';
import { NotesListsService } from './notesLists/notes-lists.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { JwtStrategy } from './auth/jwt-strategy';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '6000s' },
    }),
    NotesListsModule,
    NotesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotesListsService,
    NotesService,
    UsersService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AppModule {}
