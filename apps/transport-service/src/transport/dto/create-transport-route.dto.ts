import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTransportRouteDto {
  @ApiProperty({ example: 'Central Campus - Engineering Faculty' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Central Campus' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Engineering Faculty' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: '07:30' })
  @IsString()
  @IsNotEmpty()
  departureTime: string;

  @ApiProperty({ example: 40, minimum: 1, maximum: 120 })
  @IsInt()
  @Min(1)
  @Max(120)
  capacity: number;
}
