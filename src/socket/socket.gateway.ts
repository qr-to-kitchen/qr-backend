import {
  ConnectedSocket, MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketGateway {
  @SubscribeMessage('joinRestaurantRoom')
  joinRestaurantRoom(@ConnectedSocket() client: Socket, @MessageBody() restaurantId: string) {
    client.join(`restaurant-${restaurantId}`);
  }

  @SubscribeMessage('joinClientRoom')
  joinClientRoom(@ConnectedSocket() client: Socket, @MessageBody() clientId: string) {
    client.join(`restaurant-${clientId}`);
  }

  @SubscribeMessage('placeOrder')
  placeOrder( @ConnectedSocket() client: Socket, @MessageBody() data: { restaurantId: string; order: any }) {
    client.to(`restaurant-${data.restaurantId}`).emit('newOrder', data.order);
  }

  @SubscribeMessage('updateOrderStatus')
  updateOrderStatus(@ConnectedSocket() client: Socket, @MessageBody() data: { clientRoom: string; status: string }) {
    client.to(`client-${data.clientRoom}`).emit('orderUpdate', data.status);
  }
}