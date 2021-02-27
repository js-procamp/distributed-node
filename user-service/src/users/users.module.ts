import { ConfigModule } from '@nestjs/config';
import { UserSchema, User } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import * as redis from 'cache-manager-ioredis';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisService } from 'nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: (redisService: RedisService) => {
        return {
          store: redis,
          redisInstance: redisService.getClient(),
        };
      },
      inject: [RedisService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
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
