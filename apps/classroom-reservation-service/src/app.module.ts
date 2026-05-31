import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { databaseConfig } from './config/database.config';

import { Classroom } from './domain/entities/classroom.entity';
import { Reservation } from './domain/entities/reservation.entity';

import { ClassroomController } from './presentation/controllers/classroom.controller';
import { ReservationController } from './presentation/controllers/reservation.controller';

import { ClassroomService } from './application/use-cases/classroom.service';
import { ReservationService } from './application/use-cases/reservation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([Classroom, Reservation]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
  ],
  controllers: [ClassroomController, ReservationController],
  providers: [ClassroomService, ReservationService],
})
export class AppModule {}