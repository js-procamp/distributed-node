import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
