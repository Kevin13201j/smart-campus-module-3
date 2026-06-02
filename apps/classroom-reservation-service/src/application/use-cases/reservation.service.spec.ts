import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Classroom } from '../../domain/entities/classroom.entity';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { ReservationGateway } from '../../infrastructure/websocket/reservation.gateway';
import { ReservationEventsProducer } from '../../infrastructure/kafka/reservation-events.producer';

describe('ReservationService', () => {
  let service: ReservationService;

  const reservationRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const classroomRepositoryMock = {
    findOne: jest.fn(),
  };

  const reservationGatewayMock = {
    notifyReservationCreated: jest.fn(),
    notifyReservationApproved: jest.fn(),
    notifyReservationRejected: jest.fn(),
    notifyReservationCancelled: jest.fn(),
  };

  const reservationEventsProducerMock = {
    emitReservationCreated: jest.fn(),
    emitReservationApproved: jest.fn(),
    emitReservationRejected: jest.fn(),
    emitReservationCancelled: jest.fn(),
  };

  const createQueryBuilderMock = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    reservationRepositoryMock.createQueryBuilder.mockReturnValue(
      createQueryBuilderMock,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: reservationRepositoryMock,
        },
        {
          provide: getRepositoryToken(Classroom),
          useValue: classroomRepositoryMock,
        },
        {
          provide: ReservationGateway,
          useValue: reservationGatewayMock,
        },
        {
          provide: ReservationEventsProducer,
          useValue: reservationEventsProducerMock,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reservation when classroom is available and no conflict exists', async () => {
    const dto = {
      classroomId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      reservationDate: '2026-06-01',
      startTime: '08:00',
      endTime: '10:00',
      purpose: 'Distributed Programming class',
    };

    const classroom = {
      id: dto.classroomId,
      status: ClassroomStatus.AVAILABLE,
    };

    const reservation = {
      id: 'reservation-id',
      ...dto,
      status: ReservationStatus.PENDING,
    };

    classroomRepositoryMock.findOne.mockResolvedValue(classroom);
    createQueryBuilderMock.getOne.mockResolvedValue(null);
    reservationRepositoryMock.create.mockReturnValue(reservation);
    reservationRepositoryMock.save.mockResolvedValue(reservation);

    const result = await service.create(dto);

    expect(classroomRepositoryMock.findOne).toHaveBeenCalled();
    expect(reservationRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      status: ReservationStatus.PENDING,
    });
    expect(reservationGatewayMock.notifyReservationCreated).toHaveBeenCalledWith(
      reservation,
    );
    expect(
      reservationEventsProducerMock.emitReservationCreated,
    ).toHaveBeenCalledWith(reservation);
    expect(result).toEqual(reservation);
  });

  it('should throw BadRequestException when reservation has invalid time range', async () => {
    const dto = {
      classroomId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      reservationDate: '2026-06-01',
      startTime: '10:00',
      endTime: '08:00',
      purpose: 'Invalid reservation',
    };

    classroomRepositoryMock.findOne.mockResolvedValue({
      id: dto.classroomId,
      status: ClassroomStatus.AVAILABLE,
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when reservation conflict exists', async () => {
    const dto = {
      classroomId: '11111111-1111-1111-1111-111111111111',
      userId: '22222222-2222-2222-2222-222222222222',
      reservationDate: '2026-06-01',
      startTime: '08:00',
      endTime: '10:00',
      purpose: 'Conflict reservation',
    };

    classroomRepositoryMock.findOne.mockResolvedValue({
      id: dto.classroomId,
      status: ClassroomStatus.AVAILABLE,
    });

    createQueryBuilderMock.getOne.mockResolvedValue({
      id: 'existing-reservation-id',
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when reservation does not exist', async () => {
    reservationRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});