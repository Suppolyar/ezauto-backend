import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

import { MaintenanceService } from '../services/maintenance.service';
import { MaintenanceRecommendationResponseDto } from '../dto/maintenance-recommendation-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MaintenanceTasksService } from '../services/maintenance-tasks.service';
import { CompleteMaintenanceTaskDto } from '../dto/complete-maintenance-task.dto';
import {
  mapLogsToDtos,
  mapTasksToDtos,
} from '../lib/maintenance-task.mapper';
import { MaintenanceTaskResponseDto } from '../dto/maintenance-task-response.dto';
import { MaintenanceLogResponseDto } from '../dto/maintenance-log-response.dto';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';

interface AuthenticatedRequest extends ExpressRequest {
  user: JwtUserPayload;
}

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cars/:id/maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly maintenanceTasksService: MaintenanceTasksService,
  ) {}

  @Get('recommendations')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    description: 'Maintenance recommendations for a car',
    type: MaintenanceRecommendationResponseDto,
  })
  async getMaintenance(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<MaintenanceRecommendationResponseDto> {
    const car = await this.maintenanceTasksService.getCarForUser(
      id,
      req.user.id,
    );

    const recommendations =
      await this.maintenanceService.getRecommendations(car);

    return { recommendations };
  }

  @Get('tasks')
  @ApiOperation({ summary: 'List maintenance tasks for a car' })
  @ApiOkResponse({ type: [MaintenanceTaskResponseDto] })
  async getTasks(
    @Param('id') carId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<MaintenanceTaskResponseDto[]> {
    const tasks = await this.maintenanceTasksService.findTasks(
      carId,
      req.user.id,
    );

    return mapTasksToDtos(tasks);
  }

  @Get('logs')
  @ApiOperation({ summary: 'History of completed maintenance jobs' })
  @ApiOkResponse({ type: [MaintenanceLogResponseDto] })
  async getLogs(
    @Param('id') carId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<MaintenanceLogResponseDto[]> {
    const logs = await this.maintenanceTasksService.findLogs(
      carId,
      req.user.id,
    );

    return mapLogsToDtos(logs);
  }

  @Patch('tasks/:taskId/complete')
  @ApiOperation({ summary: 'Mark a maintenance task as completed' })
  @ApiOkResponse({ type: MaintenanceTaskResponseDto })
  async completeTask(
    @Param('id') carId: string,
    @Param('taskId') taskId: string,
    @Body() dto: CompleteMaintenanceTaskDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<MaintenanceTaskResponseDto> {
    const { task } = await this.maintenanceTasksService.completeTask({
      carId,
      taskId,
      userId: req.user.id,
      payload: {
        mileage: dto.mileage,
        notes: dto.notes,
        performedAt: dto.performedAt ? new Date(dto.performedAt) : undefined,
        redemptionId: dto.campaignRedemptionId,
      },
    });

    return mapTasksToDtos([task])[0];
  }
}
