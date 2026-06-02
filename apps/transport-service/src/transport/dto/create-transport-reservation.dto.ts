import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTransportReservationDto {
  @ApiProperty({ example: '6f5e5a76-6b69-4a85-b01f-92a603ab891a' })
  @IsUUID()
  routeId: string;

  @ApiProperty({ example: 'student-001' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'STUDENT' })
  @IsString()
  @IsNotEmpty()
  userRole: string;
}
