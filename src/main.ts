import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 8024;
  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: '*',
  });

  // Use Helmet middleware for security headers
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await app.close();
      Logger.log('Nest application closed gracefully', 'Main');
      process.exit(0);
    } catch (err) {
      Logger.error(`Error during graceful shutdown: ${err}`, '', 'Main', false);
      process.exit(1);
    }
  });

  await app.listen(port, () => {
    Logger.log(`Server running on port ${port}`, 'Main');
  });
}
bootstrap();
bootstrap();
