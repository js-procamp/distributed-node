import { kafkaConfig } from './kafkaConfig';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';

import { tap } from 'rxjs/operators';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {
    // this.client.subscribeToResponseOf('chat-topic');
    // this.client.subscribeToResponseOf('chat-topic.reply');
  }

  onModuleInit() {
    // this.client
    //   .emit('chat-topic', 'Hey,  ' + new Date())
    //   .subscribe(() => console.log('Sent'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
