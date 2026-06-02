import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classroom } from './classroom.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'classroom_id' })
  classroomId!: string;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'reservation_date', type: 'date' })
  reservationDate!: string;

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Column({ type: 'text' })
  purpose!: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status!: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}