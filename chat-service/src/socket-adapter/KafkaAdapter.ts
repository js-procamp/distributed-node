import { kafkaConfig } from './../kafkaConfig';
import { ClientKafka } from '@nestjs/microservices';
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as Adapter from 'socket.io-adapter';
import {
  Consumer,
  Kafka,
} from '@nestjs/microservices/external/kafka.interface';
import { Server } from 'socket.io';

function parseObject(data: string) {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn('Cant parse', data);
  }
}

class SocketIoKafkaAdapter extends Adapter {
  constructor(private nsp, private kafkaClient: ClientKafka) {
    super(nsp);
    if (this.nsp.name === '/chat') {
      this.init();
    }
  }

  async init() {
    const client: Kafka = this.kafkaClient.createClient();
    const consumer: Consumer = client.consumer({
      groupId: kafkaConfig().options.consumer.groupId + '-adapter',
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: 'chat-topic',
    });

    consumer.run({
      eachMessage: async ({ message }) => {
        const data = parseObject(message.value.toString());
        if (data) {
          super.broadcast(data.packet, data.opts, true);
        }
      },
    });
  }

  broadcast(packet, opts) {
    this.kafkaClient.emit('chat-topic', { packet, opts, nsp: this.nsp.name });
  }
}

export class NestIoKafkaAdapter extends IoAdapter {
  constructor(app: INestApplicationContext, private kafkaClient: ClientKafka) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    const client = this.kafkaClient;
    server.adapter(function (nsp) {
      if (nsp.name === '/chat') {
        return new SocketIoKafkaAdapter(nsp, client);
      }
      return new Adapter(nsp);
    });
    return server;
  }
}
