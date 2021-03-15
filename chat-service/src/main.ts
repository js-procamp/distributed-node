import { kafkaConfig } from './kafkaConfig';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestIoKafkaAdapter } from './socket-adapter/KafkaAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const kafka = await app.resolve('KAFKA_CLIENT');
  app.useWebSocketAdapter(new NestIoKafkaAdapter(app, kafka));
  app.connectMicroservice(kafkaConfig());
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT);
}
bootstrap();
