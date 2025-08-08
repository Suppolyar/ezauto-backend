import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CarService } from '../services/car.service';
import { CreateCarDto } from '../dto/create-car.dto';
import { CarResponseDto } from '../dto/car-response.dto';
import { Request as ExpressRequest } from 'express';
import { mapCarToDto, mapCarsToDtos } from '../lib/map-car-to-dto';

interface AuthRequest extends ExpressRequest {
  user: {
    userId: string;
  };
}

@ApiTags('Car')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ status: 201, type: CarResponseDto })
  async create(
    @Body() dto: CreateCarDto,
    @Request() req: AuthRequest,
  ): Promise<CarResponseDto> {
    const car = await this.carService.create(dto, req.user.userId);

    return mapCarToDto(car);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars for the current user' })
  @ApiResponse({ status: 200, type: [CarResponseDto] })
  async findMy(@Request() req: AuthRequest): Promise<CarResponseDto[]> {
    const cars = await this.carService.findMyCars(req.user.userId);

    return mapCarsToDtos(cars);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific car by ID' })
  @ApiResponse({ status: 200, type: CarResponseDto })
  @ApiResponse({ status: 404, description: 'Car not found' })
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthRequest,
  ): Promise<CarResponseDto> {
    const car = await this.carService.findOne(id, req.user.userId);

    if (!car) throw new NotFoundException('Car not found');

    return mapCarToDto(car);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a car by ID' })
  @ApiResponse({ status: 200, type: CarResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCarDto>,
    @Request() req: AuthRequest,
  ): Promise<CarResponseDto> {
    const car = await this.carService.update(id, dto, req.user.userId);

    return mapCarToDto(car);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car by ID' })
  @ApiResponse({ status: 204, description: 'Car successfully deleted' })
  remove(@Param('id') id: string, @Request() req: AuthRequest): Promise<void> {
    return this.carService.remove(id, req.user.userId);
  }
}
