import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassroomStatus } from '../enums/classroom-status.enum';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  building!: string;

  @Column()
  floor!: number;

  @Column()
  capacity!: number;

  @Column({ length: 50 })
  type!: string;

  @Column({
    type: 'enum',
    enum: ClassroomStatus,
    default: ClassroomStatus.AVAILABLE,
  })
  status!: ClassroomStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}