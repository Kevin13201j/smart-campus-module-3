import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { CreateTransportReservationDto } from './dto/create-transport-reservation.dto';
import { CreateTransportRouteDto } from './dto/create-transport-route.dto';
import {
  TransportReservationResponseDto,
  TransportRouteResponseDto,
} from './dto/transport-response.dto';
import { TransportService } from './transport.service';

@ApiTags('Transport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('routes')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a campus transport route' })
  @ApiCreatedResponse({ type: TransportRouteResponseDto })
  createRoute(@Body() dto: CreateTransportRouteDto) {
    return this.transportService.createRoute(dto);
  }

  @Get('routes')
  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  @ApiOperation({ summary: 'List active campus transport routes' })
  @ApiOkResponse({ type: TransportRouteResponseDto, isArray: true })
  findRoutes() {
    return this.transportService.findRoutes();
  }

  @Get('routes/:id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  @ApiOperation({ summary: 'Get a campus transport route by ID' })
  @ApiOkResponse({ type: TransportRouteResponseDto })
  findRouteById(@Param('id') id: string) {
    return this.transportService.findRouteById(id);
  }

  @Post('reservations')
  @Roles(Role.ADMIN, Role.STUDENT, Role.TEACHER)
  @ApiOperation({ summary: 'Reserve a seat for a campus transport route' })
  @ApiCreatedResponse({ type: TransportReservationResponseDto })
  createReservation(@Body() dto: CreateTransportReservationDto) {
    return this.transportService.createReservation(dto);
  }

  @Get('reservations')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List campus transport reservations' })
  @ApiOkResponse({ type: TransportReservationResponseDto, isArray: true })
  findReservations() {
    return this.transportService.findReservations();
  }

  @Delete('routes/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disable a campus transport route by ID' })
  @ApiNoContentResponse()
  removeRoute(@Param('id') id: string) {
    return this.transportService.removeRoute(id);
  }
}
