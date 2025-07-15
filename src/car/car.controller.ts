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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategiest/jwt-auth.guard';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user: {
    userId: string;
  };
}

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() dto: CreateCarDto, @Request() req: AuthRequest) {
    return this.carService.create(dto, req.user.userId);
  }

  @Get()
  findMy(@Request() req: AuthRequest) {
    return this.carService.findMyCars(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.carService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCarDto>, @Request() req: AuthRequest) {
    return this.carService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.carService.remove(id, req.user.userId);
  }
}
