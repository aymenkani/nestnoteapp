import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { User } from './users/schemas/user.schema';
import { Role } from './enums/role.enum';
import { ValidationPipe } from '@nestjs/common';

declare module 'express' {
  export interface Request {
    user?: { userId: string; email: string };
    noteListUser?: { user: User; roles: Role[] };
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
