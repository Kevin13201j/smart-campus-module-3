import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './presentation/controllers/incidents.controller';
import { HealthController } from './health.controller';
import { Incident } from './domain/entities/incident.entity';

@Module({
  imports: [
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'campus_incidents_db',
  entities: [Incident],
  synchronize: true,
}),
    TypeOrmModule.forFeature([Incident]),
  ],
  controllers: [IncidentsController, HealthController],
  providers: [],
})
export class AppModule {}