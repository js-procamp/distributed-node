import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';
import Redis from 'ioredis';

interface RedisStore extends Store {
  getClient(): Redis.Commands;
}

@Injectable()
export class RedisAdapter {
  private client: Redis.Commands;

  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    this.client = (<RedisStore>cacheManager.store).getClient();
  }

  getClient() {
    return this.client;
  }
}
