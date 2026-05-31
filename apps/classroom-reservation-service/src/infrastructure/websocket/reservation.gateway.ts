import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Reservation } from '../../domain/entities/reservation.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ReservationGateway {
  @WebSocketServer()
  server!: Server;

  notifyReservationCreated(reservation: Reservation) {
    this.server.emit('reservation.created', reservation);
  }

  notifyReservationApproved(reservation: Reservation) {
    this.server.emit('reservation.approved', reservation);
  }

  notifyReservationRejected(reservation: Reservation) {
    this.server.emit('reservation.rejected', reservation);
  }

  notifyReservationCancelled(reservation: Reservation) {
    this.server.emit('reservation.cancelled', reservation);
  }
}