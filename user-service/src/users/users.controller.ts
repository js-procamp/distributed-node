import { ClearCacheInterceptor } from './../cache/ClearCacheInterceptor';
import { IUsersService } from './interfaces/IUserService';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Inject,
  Logger,
  UseInterceptors,
  CacheTTL,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'nestjs-redis';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject('IUsersService') private readonly usersService: IUsersService,
    redisService: RedisService,
  ) {
    redisService.getClient().set('hello', 'world');
  }

  @Post()
  @UseInterceptors(ClearCacheInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(
      'Someone is creating a user' + JSON.stringify(createUserDto),
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  //@UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  async findAll() {
    await new Promise((r) => setTimeout(r, 5000));
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
