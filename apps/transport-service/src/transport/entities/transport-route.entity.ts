import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransportReservation } from './transport-reservation.entity';

@Entity({ name: 'transport_routes' })
export class TransportRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ name: 'departure_time' })
  departureTime: string;

  @Column()
  capacity: number;

  @Column({ name: 'reserved_seats', default: 0 })
  reservedSeats: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => TransportReservation, (reservation) => reservation.route)
  reservations: TransportReservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;
}
