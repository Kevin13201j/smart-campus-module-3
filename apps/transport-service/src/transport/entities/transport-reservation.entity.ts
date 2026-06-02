import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TransportRoute } from './transport-route.entity';

@Entity({ name: 'transport_reservations' })
export class TransportReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'route_id' })
  routeId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_role' })
  userRole: string;

  @Column({ default: 'CONFIRMED' })
  status: string;

  @ManyToOne(() => TransportRoute, (route) => route.reservations)
  @JoinColumn({ name: 'route_id' })
  route: TransportRoute;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
