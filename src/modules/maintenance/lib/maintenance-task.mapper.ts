import { MaintenanceTask } from '../../../entities/maintenance-task.entity';
import { MaintenanceTaskResponseDto } from '../dto/maintenance-task-response.dto';
import { MaintenanceLog } from '../../../entities/maintenance-log.entity';
import { MaintenanceLogResponseDto } from '../dto/maintenance-log-response.dto';

export const mapTaskToDto = (
  task: MaintenanceTask,
): MaintenanceTaskResponseDto => ({
  id: task.id,
  status: task.status,
  dueDate: task.dueDate,
  dueMileage: task.dueMileage ?? undefined,
  completedAt: task.completedAt,
  completedMileage: task.completedMileage ?? undefined,
  regulation: {
    item: task.regulation.item,
    intervalMiles: task.regulation.intervalMiles,
    intervalMonths: task.regulation.intervalMonths,
    description: task.regulation.description,
    severity: task.regulation.severity,
  },
});

export const mapTasksToDtos = (
  tasks: MaintenanceTask[],
): MaintenanceTaskResponseDto[] => tasks.map(mapTaskToDto);

export const mapLogToDto = (
  log: MaintenanceLog,
): MaintenanceLogResponseDto => {
  const metadata = log.metadata as Record<string, unknown> | undefined;
  const notes =
    metadata && typeof metadata['notes'] === 'string'
      ? (metadata['notes'] as string)
      : undefined;

  return {
    id: log.id,
    title: log.title,
    description: log.description ?? undefined,
    mileage: log.mileage,
    performedAt: log.performedAt,
    notes,
  };
};

export const mapLogsToDtos = (
  logs: MaintenanceLog[],
): MaintenanceLogResponseDto[] => logs.map(mapLogToDto);
