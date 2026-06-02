import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransportReservationDto } from './dto/create-transport-reservation.dto';
import { CreateTransportRouteDto } from './dto/create-transport-route.dto';
import { TransportReservation } from './entities/transport-reservation.entity';
import { TransportRoute } from './entities/transport-route.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(TransportRoute)
    private readonly routeRepository: Repository<TransportRoute>,
    @InjectRepository(TransportReservation)
    private readonly reservationRepository: Repository<TransportReservation>,
  ) {}

  async createRoute(dto: CreateTransportRouteDto): Promise<TransportRoute> {
    const route = this.routeRepository.create({
      ...dto,
      reservedSeats: 0,
      active: true,
    });

    return this.routeRepository.save(route);
  }

  async findRoutes(): Promise<TransportRoute[]> {
    return this.routeRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findRouteById(id: string): Promise<TransportRoute> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route || !route.active) {
      throw new NotFoundException('Transport route was not found.');
    }

    return route;
  }

  async createReservation(
    dto: CreateTransportReservationDto,
  ): Promise<TransportReservation> {
    const route = await this.findRouteById(dto.routeId);

    if (route.reservedSeats >= route.capacity) {
      throw new ConflictException('Transport route has no available seats.');
    }

    const reservation = this.reservationRepository.create({
      routeId: route.id,
      userId: dto.userId,
      userRole: dto.userRole,
      status: 'CONFIRMED',
    });

    route.reservedSeats += 1;
    await this.routeRepository.save(route);

    return this.reservationRepository.save(reservation);
  }

  async findReservations(): Promise<TransportReservation[]> {
    return this.reservationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async removeRoute(id: string): Promise<void> {
    const route = await this.findRouteById(id);
    route.active = false;
    await this.routeRepository.save(route);
  }
}
