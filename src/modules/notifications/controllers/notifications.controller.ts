import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { RegisterPushTokenDto } from '../dto/register-push-token.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Notification } from '../../../entities/notification.entity';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';

interface AuthenticatedRequest extends Request {
  user: JwtUserPayload;
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOkResponse({ type: [Notification] })
  list(@Request() req: AuthenticatedRequest): Promise<Notification[]> {
    return this.notificationsService.list(req.user.id);
  }

  @Post('push-tokens')
  registerToken(
    @Request() req: AuthenticatedRequest,
    @Body() dto: RegisterPushTokenDto,
  ) {
    return this.notificationsService.registerPushToken(req.user.id, dto);
  }
}
