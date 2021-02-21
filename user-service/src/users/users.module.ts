import { RedisMediator } from './../cache/RedisMediator';
import { ConfigModule } from '@nestjs/config';
import { UserSchema, User } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import * as redis from 'cache-manager-ioredis';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register({
      store: redis,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 0,
    }),
  ],
  controllers: [UsersController],
  providers: [
    RedisMediator,
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
