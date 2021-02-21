import { RedisMediator } from './../cache/RedisMediator';
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
  UsePipes,
  ValidationPipe,
  Logger,
  CACHE_MANAGER,
  UseInterceptors,
  CacheTTL,
} from '@nestjs/common';

import { Cache } from 'cache-manager';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheClearInterceptor } from 'src/cache/CacheClearInterceptor';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private redis: RedisMediator,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('IUsersService') private readonly usersService: IUsersService,
  ) {
    redis
      .getClient()
      .lrange('mylist', 0, -1)
      .then((r) => console.log('>>>', r));
    redis
      .getClient()
      .llen('mylist')
      .then((r) => console.log('>>>', r));
    redis
      .getClient()
      .hmset(
        'mymap',
        new Map([
          ['hello', '1'],
          ['world', '2'],
        ]),
      )
      .then((r) => console.log('>>>', r));

    redis
      .getClient()
      .hgetall('mymap')
      .then((r) => console.log('>>>', r));

    let i = 0;
    setInterval(() => {
      this.cacheManager
        .set('asd', i++)
        .then(() => console.log('Write', i - 1))
        .then(() => this.cacheManager.get('asd'))
        .then((r) => console.log('Read', r))
        .catch((e) => console.log('!!!!!!!!', e));
    }, 5000);
  }

  @Post()
  @UseInterceptors(CacheClearInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(
      'Someone is creating a user' + JSON.stringify(createUserDto),
    );
    return this.usersService.create(createUserDto);
  }

  @Get()
  //@UseInterceptors(CacheInterceptor)
  @CacheTTL(1000)
  async findAll() {
    await new Promise((r) => setTimeout(r, 10000));
    console.log('done');
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
