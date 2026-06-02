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

import { ClassroomService } from '../../application/use-cases/classroom.service';
import { CreateClassroomDto } from '../../application/dto/create-classroom.dto';
import { UpdateClassroomDto } from '../../application/dto/update-classroom.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';

@ApiTags('Classrooms')
@ApiBearerAuth()
@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.classroomService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

    
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }
}