import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
