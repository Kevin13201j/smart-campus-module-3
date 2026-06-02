import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { TransportController } from '../src/transport/transport.controller';
import { TransportService } from '../src/transport/transport.service';

describe('TransportController', () => {
  let controller: TransportController;
  const service = {
    createRoute: jest.fn(),
    findRoutes: jest.fn(),
    findRouteById: jest.fn(),
    createReservation: jest.fn(),
    findReservations: jest.fn(),
    removeRoute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        {
          provide: TransportService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(TransportController);
  });

  it('delegates route creation to the service', async () => {
    const dto = {
      name: 'Central Campus - Engineering Faculty',
      origin: 'Central Campus',
      destination: 'Engineering Faculty',
      departureTime: '07:30',
      capacity: 40,
    };
    service.createRoute.mockResolvedValue({ id: 'route-id', ...dto });

    await expect(controller.createRoute(dto)).resolves.toEqual({
      id: 'route-id',
      ...dto,
    });
  });

  it('delegates route retrieval to the service', async () => {
    service.findRoutes.mockResolvedValue([]);

    await expect(controller.findRoutes()).resolves.toEqual([]);
  });
});
