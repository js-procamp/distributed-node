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
    console.warn('Cant parse');
  }
}

class MyAdapter extends Adapter {
  constructor(private nsp, private kafkaClient: ClientKafka) {
    super(nsp);
    this.init();
  }

  async init() {
    const client: Kafka = this.kafkaClient.createClient();
    const consumer: Consumer = client.consumer({
      groupId: process.env.HOSTNAME || 'default-consumer-2',
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: 'chat-topic',
    });

    consumer.run({
      eachMessage: async ({ message }) => {
        const data = parseObject(message.value.toString());
        if (data) {
          console.log('>>>new data', data.packet);
          super.broadcast(data.packet, data.opts, true);
        }
      },
    });
  }

  broadcast(packet, opts) {
    this.kafkaClient.emit('chat-topic', { packet, opts, nsp: this.nsp.name });
  }
}

export class KafkaAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplicationContext,
    private kafkaClient: ClientKafka,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    const client = this.kafkaClient;
    server.adapter(function (nsp) {
      return new MyAdapter(nsp, client);
    });
    return server;
  }
}
