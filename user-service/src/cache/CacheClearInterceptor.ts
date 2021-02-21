import { Observable } from 'rxjs';
import {
  Inject,
  CACHE_MANAGER,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheClearInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap((a) => {
        console.log(`After...`, a);
        console.log(this.cacheManager.reset());
      }),
    );
  }
}
