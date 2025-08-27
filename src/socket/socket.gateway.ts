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
  @SubscribeMessage('joinBranchRoom')
  joinBranchRoom(@ConnectedSocket() client: Socket, @MessageBody() branchId: string) {
    client.join(`branch-${branchId}`);
  }

  @SubscribeMessage('joinOrderRoom')
  joinOrderRoom(@ConnectedSocket() client: Socket, @MessageBody() orderId: string) {
    client.join(`order-${orderId}`);
  }

  @SubscribeMessage('placeOrder')
  placeOrder( @ConnectedSocket() client: Socket, @MessageBody() data: { branchId: string }) {
    client.to(`branch-${data.branchId}`).emit('newOrder');
  }

  @SubscribeMessage('updateOrder')
  updateOrder(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId: string }) {
    client.to(`order-${data.orderId}`).emit('orderUpdate');
  }
}