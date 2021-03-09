import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig = (): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'my-client',
      brokers: [process.env.KAFKA_URL],
    },
    consumer: {
      groupId: process.env.HOSTNAME || 'default-consumer',
    },
  },
});
