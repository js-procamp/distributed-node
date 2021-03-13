import { Module } from '@nestjs/common';
import { ChatGateway, Kfk } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  controllers: [Kfk],
})
export class ChatModule {}
