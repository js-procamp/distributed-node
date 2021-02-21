import { Cache } from 'cache-manager';
import { RedisStore } from './RedisStore';
import Redis from 'ioredis';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisMediator {
  private client: Redis.Commands;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.client = (<RedisStore>this.cacheManager.store).getClient();
  }

  getClient() {
    return this.client;
  }
}
