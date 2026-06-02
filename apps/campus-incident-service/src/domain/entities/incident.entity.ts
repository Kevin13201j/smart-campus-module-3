import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncidentPriority } from '../enums/incident-priority.enum';
import { IncidentStatus } from '../enums/incident-status.enum';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({ default: 'GENERAL' })
  category: string;

  @Column({ type: 'varchar', default: IncidentPriority.MEDIUM })
  priority: IncidentPriority;

  @Column({ type: 'varchar', default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @Column({ default: 'anonymous' })
  reportedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}