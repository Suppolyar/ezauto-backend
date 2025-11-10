import { Controller, Get, Post, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkshopOffersService } from '../services/workshop-offers.service';
import { WorkshopOffersQueryDto } from '../dto/workshop-offers-query.dto';
import { WorkshopOfferDto } from '../dto/workshop-offer.dto';
import { RedeemOfferDto } from '../dto/redeem-offer.dto';
import { WorkshopRedemptionDto } from '../dto/workshop-redemption.dto';
import { WorkshopRedemptionService } from '../services/workshop-redemption.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtUserPayload } from '../../../shared/types/jwt-payload';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: JwtUserPayload;
}

@ApiTags('Workshops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workshops')
export class WorkshopsController {
  constructor(
    private readonly offersService: WorkshopOffersService,
    private readonly redemptionService: WorkshopRedemptionService,
  ) {}

  @Get('offers')
  @ApiOperation({ summary: 'List partner offers near the user' })
  @ApiOkResponse({ type: [WorkshopOfferDto] })
  async listOffers(
    @Query() query: WorkshopOffersQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<WorkshopOfferDto[]> {
    return this.offersService.listOffers({
      userId: req.user.id,
      filters: query,
    });
  }

  @Post('offers/redeem')
  @ApiOperation({ summary: 'Redeem a workshop offer by scanning QR' })
  @ApiOkResponse({ type: WorkshopRedemptionDto })
  async redeemOffer(
    @Body() dto: RedeemOfferDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<WorkshopRedemptionDto> {
    const redemption = await this.redemptionService.redeem(req.user.id, dto);

    return {
      id: redemption.id,
      campaignId: redemption.campaign.id,
      campaignTitle: redemption.campaign.title,
      workshopName: redemption.campaign.workshop.brandName,
      locationTitle: redemption.location?.title ?? 'Any location',
      note: redemption.note ?? undefined,
      status: redemption.status,
      redeemedAt: redemption.redeemedAt ?? undefined,
    };
  }

  @Get('redemptions')
  @ApiOperation({ summary: 'List latest redemptions for current user' })
  @ApiOkResponse({ type: [WorkshopRedemptionDto] })
  async listRedemptions(
    @Request() req: AuthenticatedRequest,
  ): Promise<WorkshopRedemptionDto[]> {
    return this.redemptionService.listUserRedemptions(req.user.id);
  }
}
