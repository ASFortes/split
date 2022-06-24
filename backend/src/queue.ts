import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { QueueModule } from './queue/queue.module';

async function bootstrap() {
  const logger: Logger = new Logger('AppGateway');

  const app = await NestFactory.create(QueueModule, { cors: true });

  const port = 9876;
  await app.listen(port);

  logger.log(`Queue is running at ${port}`);
}
bootstrap();
