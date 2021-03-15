import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import randomLogin from '../utils/genNickname';
import { Logger, Controller } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

type ChatKafkaMessage = KafkaMessage & {
  value: {
    packet: {
      data: [string, any];
    };
  };
};

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private connected: Map<string, string> = new Map();

  @WebSocketServer() server;

  handleDisconnect(client: Socket) {
    const nick = this.connected.get(client.id);
    this.logger.log(nick + ' Client disconnected ' + client.id);
    this.connected.delete(client.id);
    this.server.emit('userDisconnected', nick);
    this.server.emit('message', { msg: `~ ${nick} disconnected` });
  }

  handleConnection(client: Socket) {
    const nick = randomLogin();
    this.logger.log(client.id + ' Client connected ' + nick);
    this.connected.set(client.id, nick);

    client.emit('message', { msg: `Welcome #${nick}`, currUserId: nick });
    client.emit('activeUsers', Array.from(this.connected.values()));

    client.broadcast.emit('message', { msg: `${nick} connected to the chat` });
    this.server.emit('userConnected', { nick, id: client.id });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() msg: string,
    @ConnectedSocket() client: Socket,
  ) {
    const time = new Date();
    const nick = this.connected.get(client.id);
    this.server.emit('message', {
      msg,
      user: nick,
      time: `${time.getHours()}:${time.getMinutes()}`,
    });
  }

  syncKafka([action, payload]: [string, any]) {
    if (action === 'userConnected') {
      this.connected.set(payload.id, payload.nick);
    } else if (action === 'userDisconnected') {
      this.connected.delete(payload.id);
    }
  }
}

@Controller()
export class Kfk {
  constructor(private readonly chat: ChatGateway) {}

  @EventPattern('chat-topic')
  processKafkaMessage(@Payload() message: ChatKafkaMessage) {
    console.log('New kafka message', message.value);
    this.chat.syncKafka(message.value.packet.data);
  }
}
