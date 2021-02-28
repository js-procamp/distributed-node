import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'my-client',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: process.env.HOSTNAME || 'default-consumer',
    },
  },
};
