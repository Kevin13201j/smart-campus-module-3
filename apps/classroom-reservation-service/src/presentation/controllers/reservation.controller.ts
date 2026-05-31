import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ReservationService } from '../../application/use-cases/reservation.service';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';
import { UpdateReservationDto } from '../../application/dto/update-reservation.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  
  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }
  
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  approve(@Param('id') id: string) {
    return this.reservationService.approve(id);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  reject(@Param('id') id: string) {
    return this.reservationService.reject(id);
  }

  @Post(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT)
  cancel(@Param('id') id: string) {
    return this.reservationService.cancel(id);
  }
}