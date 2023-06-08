import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';





async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'https://api.intra.42.fr/auth/authorize'],
    methods: 'GET, POST',
  });
  

  app.use(
    session({
      secret: 'top',
      resave: false,
      saveUninitialized: false,
    }),
  );

await app.listen(3000);
  }
bootstrap();
