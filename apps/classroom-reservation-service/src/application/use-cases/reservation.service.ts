import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from '../../domain/entities/reservation.entity';
import { Classroom } from '../../domain/entities/classroom.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: {
        classroom: true,
        },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: {
        classroom: true,
        },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} was not found`);
    }

    return reservation;
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    await this.validateClassroomAvailability(createReservationDto.classroomId);
    this.validateTimeRange(createReservationDto.startTime, createReservationDto.endTime);

    const hasConflict = await this.hasReservationConflict(
      createReservationDto.classroomId,
      createReservationDto.reservationDate,
      createReservationDto.startTime,
      createReservationDto.endTime,
    );

    if (hasConflict) {
      throw new BadRequestException('Reservation conflict detected for this classroom and time range');
    }

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      status: ReservationStatus.PENDING,
    });

    return this.reservationRepository.save(reservation);
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);

    const classroomId = updateReservationDto.classroomId ?? reservation.classroomId;
    const reservationDate = updateReservationDto.reservationDate ?? reservation.reservationDate;
    const startTime = updateReservationDto.startTime ?? reservation.startTime;
    const endTime = updateReservationDto.endTime ?? reservation.endTime;

    this.validateTimeRange(startTime, endTime);

    const hasConflict = await this.hasReservationConflict(
      classroomId,
      reservationDate,
      startTime,
      endTime,
      id,
    );

    if (hasConflict) {
      throw new BadRequestException('Reservation conflict detected for this classroom and time range');
    }

    Object.assign(reservation, updateReservationDto);

    return this.reservationRepository.save(reservation);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);

    await this.reservationRepository.remove(reservation);
  }

  async approve(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be approved');
    }

    reservation.status = ReservationStatus.APPROVED;

    return this.reservationRepository.save(reservation);
  }

  async reject(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be rejected');
    }

    reservation.status = ReservationStatus.REJECTED;

    return this.reservationRepository.save(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (
      reservation.status === ReservationStatus.CANCELLED ||
      reservation.status === ReservationStatus.COMPLETED
    ) {
      throw new BadRequestException('This reservation cannot be cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;

    return this.reservationRepository.save(reservation);
  }

  private async validateClassroomAvailability(classroomId: string): Promise<void> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${classroomId} was not found`);
    }

    if (classroom.status !== ClassroomStatus.AVAILABLE) {
      throw new BadRequestException('Classroom is not available');
    }
  }

  private validateTimeRange(startTime: string, endTime: string): void {
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be earlier than end time');
    }
  }

  private async hasReservationConflict(
    classroomId: string,
    reservationDate: string,
    startTime: string,
    endTime: string,
    excludedReservationId?: string,
  ): Promise<boolean> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.classroom_id = :classroomId', { classroomId })
      .andWhere('reservation.reservation_date = :reservationDate', { reservationDate })
      .andWhere('reservation.status IN (:...statuses)', {
        statuses: [ReservationStatus.PENDING, ReservationStatus.APPROVED],
      })
      .andWhere('reservation.start_time < :endTime', { endTime })
      .andWhere('reservation.end_time > :startTime', { startTime });

    if (excludedReservationId) {
      query.andWhere('reservation.id != :excludedReservationId', {
        excludedReservationId,
      });
    }

    const conflict = await query.getOne();

    return Boolean(conflict);
  }
}