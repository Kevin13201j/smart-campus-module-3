import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Classroom } from '../../domain/entities/classroom.entity';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOne({
      where: { id },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${id} was not found`);
    }

    return classroom;
  }

  async create(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
    const classroom = this.classroomRepository.create({
      ...createClassroomDto,
      status: createClassroomDto.status ?? ClassroomStatus.AVAILABLE,
    });

    return this.classroomRepository.save(classroom);
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto): Promise<Classroom> {
    const classroom = await this.findOne(id);

    Object.assign(classroom, updateClassroomDto);

    return this.classroomRepository.save(classroom);
  }

  async remove(id: string): Promise<void> {
    const classroom = await this.findOne(id);

    await this.classroomRepository.remove(classroom);
  }

  async findAvailable(): Promise<Classroom[]> {
    return this.classroomRepository.find({
      where: { status: ClassroomStatus.AVAILABLE },
      order: { building: 'ASC', floor: 'ASC', name: 'ASC' },
    });
  }
}