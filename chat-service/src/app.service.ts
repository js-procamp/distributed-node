import { kafkaConfig } from './kafkaConfig';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka } from '@nestjs/microservices';

import { tap } from 'rxjs/operators';

@Injectable()
export class AppService implements OnModuleInit {


  constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {
    // this.client.subscribeToResponseOf('chat-topic');
    // this.client.subscribeToResponseOf('chat-topic.reply');
   // console.log('>>>>>', this.kafkaClient.emit('chat-topic', 'hey'))
  }

  onModuleInit() {
    console.log('>>>>>>asdasd1');
    // console.log('>>>>', this.client);
    // this.client
    //   .emit('chat-topic', 'Hey,  ' + new Date())
    //   .pipe(tap((r) => console.log('>>>r', r)))
    //   .subscribe(() => console.log('HEY'));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
