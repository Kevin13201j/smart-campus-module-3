import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty()
  @IsUUID()
  classroomId!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  reservationDate!: string;

  @ApiProperty({ example: '08:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime!: string;

  @ApiProperty({ example: '10:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  purpose!: string;
}