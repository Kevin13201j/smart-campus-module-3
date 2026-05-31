import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';

export class CreateClassroomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  building!: string;

  @ApiProperty()
  @IsInt()
  floor!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  capacity!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ enum: ClassroomStatus, required: false })
  @IsOptional()
  @IsEnum(ClassroomStatus)
  status?: ClassroomStatus;
}