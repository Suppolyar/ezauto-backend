import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkshopsAdminService } from '../services/workshops-admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWorkshopDto } from '../dto/create-workshop.dto';
import { CreateWorkshopLocationDto } from '../dto/create-location.dto';
import { CreateWorkshopCampaignDto } from '../dto/create-campaign.dto';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';

interface AdminRequest extends Request {
  user: JwtUserPayload;
}

@ApiTags('Workshops Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/workshops')
export class WorkshopsAdminController {
  constructor(private readonly workshopsAdminService: WorkshopsAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workshop profile' })
  createWorkshop(
    @Body() dto: CreateWorkshopDto,
    @Request() req: AdminRequest,
  ) {
    this.workshopsAdminService.ensureWorkshopRole(req.user);
    return this.workshopsAdminService.createWorkshop(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List workshops managed by current user' })
  listMy(@Request() req: AdminRequest) {
    this.workshopsAdminService.ensureWorkshopRole(req.user);
    return this.workshopsAdminService.listMyWorkshops(req.user.id);
  }

  @Post(':id/locations')
  @ApiOperation({ summary: 'Add a physical location to a workshop' })
  addLocation(
    @Param('id') workshopId: string,
    @Body() dto: CreateWorkshopLocationDto,
    @Request() req: AdminRequest,
  ) {
    this.workshopsAdminService.ensureWorkshopRole(req.user);
    return this.workshopsAdminService.addLocation(
      workshopId,
      req.user.id,
      dto,
    );
  }

  @Post(':id/campaigns')
  @ApiOperation({ summary: 'Create a marketing campaign' })
  createCampaign(
    @Param('id') workshopId: string,
    @Body() dto: CreateWorkshopCampaignDto,
    @Request() req: AdminRequest,
  ) {
    this.workshopsAdminService.ensureWorkshopRole(req.user);
    return this.workshopsAdminService.createCampaign(
      workshopId,
      req.user.id,
      dto,
    );
  }
}
