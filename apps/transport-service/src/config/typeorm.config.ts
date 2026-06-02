import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { TransportReservation } from '../transport/entities/transport-reservation.entity';
import { TransportRoute } from '../transport/entities/transport-route.entity';

export const createTypeOrmOptions = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME ?? 'smart_campus',
  password: process.env.DATABASE_PASSWORD ?? 'smart_campus',
  database: process.env.DATABASE_NAME ?? 'smart_campus_transport',
  entities: [TransportRoute, TransportReservation],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
});
