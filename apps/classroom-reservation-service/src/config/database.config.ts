import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Classroom } from '../domain/entities/classroom.entity';
import { Reservation } from '../domain/entities/reservation.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Classroom, Reservation],
  synchronize: true,
});