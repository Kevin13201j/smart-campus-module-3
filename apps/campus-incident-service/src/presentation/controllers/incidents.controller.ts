import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../../domain/entities/incident.entity';
import { IncidentPriority } from '../../domain/enums/incident-priority.enum';
import { IncidentStatus } from '../../domain/enums/incident-status.enum';

@ApiTags('Campus Incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a campus incident report' })
  async create(@Body() body: Partial<Incident>): Promise<Incident> {
    const incident = this.incidentRepository.create({
      title: body.title ?? '',
      description: body.description ?? '',
      location: body.location ?? '',
      category: body.category ?? 'GENERAL',
      priority: body.priority ?? IncidentPriority.MEDIUM,
      status: IncidentStatus.OPEN,
      reportedBy: body.reportedBy ?? 'anonymous',
    });

    return this.incidentRepository.save(incident);
  }

  @Get()
  @ApiOperation({ summary: 'List campus incidents' })
  async findAll(): Promise<Incident[]> {
    return this.incidentRepository.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a campus incident by id' })
  async findOne(@Param('id') id: string): Promise<Incident | { message: string }> {
    const incident = await this.incidentRepository.findOne({
      where: { id: Number(id) },
    });

    if (!incident) {
      return { message: 'Incident not found' };
    }

    return incident;
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update campus incident status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: IncidentStatus,
  ): Promise<Incident | { message: string }> {
    const incident = await this.incidentRepository.findOne({
      where: { id: Number(id) },
    });

    if (!incident) {
      return { message: 'Incident not found' };
    }

    incident.status = status;
    return this.incidentRepository.save(incident);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campus incident' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const incident = await this.incidentRepository.findOne({
      where: { id: Number(id) },
    });

    if (!incident) {
      return { message: 'Incident not found' };
    }

    await this.incidentRepository.delete(Number(id));

    return { message: 'Incident deleted successfully' };
  }
}