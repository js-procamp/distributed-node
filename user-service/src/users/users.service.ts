import { User } from './entities/user.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService } from './interfaces/IUserService';

import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new Logger(UsersService.name);
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    await new Promise((res) => {
      setTimeout(res, 5000);
    });

    const user = new User(
      uuid(),
      createUserDto.username,
      createUserDto.password,
    );

    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      this.logger.warn(`User with id ${id} doen't exist`);
      this.logger.error(`User with id ${id} doen't exist`);
      this.logger.debug(`User with id ${id} doen't exist`);
      throw new NotFoundException(`User with id ${id} doen't exist`);
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    user.username = updateUserDto.username ?? user.username;
    user.password = updateUserDto.password ?? user.password;

    return user;
  }

  remove(id: string) {
    this.users = this.users.filter((u) => u.id !== id);

    return id;
  }
}
