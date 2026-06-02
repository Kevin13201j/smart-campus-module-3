import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check campus-incident-service health status' })
  @Get()
  check() {
    return {
      service: 'campus-incident-service',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}