import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Reservation } from '../../domain/entities/reservation.entity';

@Injectable()
export class ReservationEventsProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReservationEventsProducer.name);
  private producer!: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'classroom-reservation-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = kafka.producer();
    await this.producer.connect();

    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async emitReservationCreated(reservation: Reservation) {
    await this.emitEvent('reservation.created', reservation);
  }

  async emitReservationApproved(reservation: Reservation) {
    await this.emitEvent('reservation.approved', reservation);
  }

  async emitReservationRejected(reservation: Reservation) {
    await this.emitEvent('reservation.rejected', reservation);
  }

  async emitReservationCancelled(reservation: Reservation) {
    await this.emitEvent('reservation.cancelled', reservation);
  }

  private async emitEvent(topic: string, reservation: Reservation) {
    await this.producer.send({
      topic,
      messages: [
        {
          key: reservation.id,
          value: JSON.stringify({
            reservationId: reservation.id,
            classroomId: reservation.classroomId,
            userId: reservation.userId,
            status: reservation.status,
            reservationDate: reservation.reservationDate,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    this.logger.log(`Kafka event emitted: ${topic}`);
  }
}