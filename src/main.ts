import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Serializer } from './common/adapter/serializer.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serializer = new Serializer();

  app.use(
    helmet({
      xPoweredBy: false,
    }),
  );
  app.enableCors({
    origin: [...serializer.env.parseArray(process.env.ALLOWED_ORIGINS)],
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
