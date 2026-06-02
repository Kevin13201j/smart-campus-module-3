import { ApiProperty } from '@nestjs/swagger';

export class TransportRouteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  departureTime: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  reservedSeats: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class TransportReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  routeId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userRole: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
