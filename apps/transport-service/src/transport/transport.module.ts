import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransportReservation } from './entities/transport-reservation.entity';
import { TransportRoute } from './entities/transport-route.entity';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransportRoute, TransportReservation])],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
