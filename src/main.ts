import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { User } from './users/schemas/user.schema';
import { Role } from './enums/role.enum';

declare module 'express-session' {
  export interface SessionData {
    jwt: string;
  }
}

declare module 'express' {
  export interface Request {
    user?: { userId: string; email: string };
    noteListUser?: { user: User; roles: Role[] };
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, signed: false },
    }),
  );

  await app.listen(3000);
}
bootstrap();
