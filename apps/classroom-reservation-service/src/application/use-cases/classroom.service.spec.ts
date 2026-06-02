import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { ClassroomService } from './classroom.service';
import { Classroom } from '../../domain/entities/classroom.entity';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';

describe('ClassroomService', () => {
  let service: ClassroomService;

  const classroomRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassroomService,
        {
          provide: getRepositoryToken(Classroom),
          useValue: classroomRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ClassroomService>(ClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a classroom with AVAILABLE status by default', async () => {
    const dto = {
      name: 'Room A101',
      building: 'Engineering Building',
      floor: 1,
      capacity: 40,
      type: 'LAB',
    };

    const classroom = {
      id: 'classroom-id',
      ...dto,
      status: ClassroomStatus.AVAILABLE,
    };

    classroomRepositoryMock.create.mockReturnValue(classroom);
    classroomRepositoryMock.save.mockResolvedValue(classroom);

    const result = await service.create(dto);

    expect(classroomRepositoryMock.create).toHaveBeenCalledWith({
      ...dto,
      status: ClassroomStatus.AVAILABLE,
    });
    expect(result).toEqual(classroom);
  });

  it('should return all classrooms', async () => {
    const classrooms = [
      {
        id: 'classroom-id',
        name: 'Room A101',
        building: 'Engineering Building',
        floor: 1,
        capacity: 40,
        type: 'LAB',
        status: ClassroomStatus.AVAILABLE,
      },
    ];

    classroomRepositoryMock.find.mockResolvedValue(classrooms);

    const result = await service.findAll();

    expect(classroomRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(classrooms);
  });

  it('should throw NotFoundException when classroom does not exist', async () => {
    classroomRepositoryMock.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});