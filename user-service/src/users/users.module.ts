import { RedisAdapter } from './../cache/RedisAdapter';
import { ConfigModule } from '@nestjs/config';
import { UserSchema, User } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import * as redis from 'cache-manager-ioredis';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redis,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    RedisAdapter,
    {
      provide: 'IUsersService',
      useClass: UsersService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class UsersModule {}
