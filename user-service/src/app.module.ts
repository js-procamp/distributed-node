import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
