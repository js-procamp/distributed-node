import { Store } from 'cache-manager';
import Redis from 'ioredis';

export interface RedisStore extends Store {
  getClient(): Redis.Commands;
}
