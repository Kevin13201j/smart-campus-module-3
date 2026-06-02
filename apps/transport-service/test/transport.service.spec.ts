import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransportReservation } from '../src/transport/entities/transport-reservation.entity';
import { TransportRoute } from '../src/transport/entities/transport-route.entity';
import { TransportService } from '../src/transport/transport.service';

type MockRepository<T extends object = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createRouteRepositoryMock = (): MockRepository<TransportRoute> => ({
  create: jest.fn((entity: Partial<TransportRoute>) => entity),
  save: jest.fn((entity: Partial<TransportRoute>) =>
    Promise.resolve({ id: 'route-id', ...entity }),
  ),
  find: jest.fn(),
  findOne: jest.fn(),
});

const createReservationRepositoryMock =
  (): MockRepository<TransportReservation> => ({
    create: jest.fn((entity: Partial<TransportReservation>) => entity),
    save: jest.fn((entity: Partial<TransportReservation>) =>
      Promise.resolve({ id: 'reservation-id', ...entity }),
    ),
    find: jest.fn(),
  });

describe('TransportService', () => {
  let service: TransportService;
  let routeRepository: MockRepository<TransportRoute>;
  let reservationRepository: MockRepository<TransportReservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportService,
        {
          provide: getRepositoryToken(TransportRoute),
          useValue: createRouteRepositoryMock(),
        },
        {
          provide: getRepositoryToken(TransportReservation),
          useValue: createReservationRepositoryMock(),
        },
      ],
    }).compile();

    service = module.get(TransportService);
    routeRepository = module.get(getRepositoryToken(TransportRoute));
    reservationRepository = module.get(getRepositoryToken(TransportReservation));
  });

  it('creates a transport route', async () => {
    const result = await service.createRoute({
      name: 'Central Campus - Engineering Faculty',
      origin: 'Central Campus',
      destination: 'Engineering Faculty',
      departureTime: '07:30',
      capacity: 40,
    });

    expect(result.active).toBe(true);
    expect(result.reservedSeats).toBe(0);
    expect(routeRepository.save).toHaveBeenCalled();
  });

  it('creates a reservation when seats are available', async () => {
    routeRepository.findOne?.mockResolvedValue({
      id: 'route-id',
      active: true,
      capacity: 2,
      reservedSeats: 0,
    });

    const result = await service.createReservation({
      routeId: 'route-id',
      userId: 'student-001',
      userRole: 'STUDENT',
    });

    expect(result.status).toBe('CONFIRMED');
    expect(reservationRepository.save).toHaveBeenCalled();
  });

  it('rejects reservations when the route is full', async () => {
    routeRepository.findOne?.mockResolvedValue({
      id: 'route-id',
      active: true,
      capacity: 1,
      reservedSeats: 1,
    });

    await expect(
      service.createReservation({
        routeId: 'route-id',
        userId: 'student-001',
        userRole: 'STUDENT',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when a route is not found', async () => {
    routeRepository.findOne?.mockResolvedValue(null);

    await expect(service.findRouteById('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
