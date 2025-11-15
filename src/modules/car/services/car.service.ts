import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCarDto } from '../dto/create-car.dto';
import { Car } from '../../../entities/car.entity';
import { VinDecoderService } from '../../vin/services/vin-decoder.service';
import { MaintenancePlannerService } from '../../maintenance/services/maintenance-planner.service';
import { User } from '../../auth/entities/user.entity';
import { CarTypeResolverService } from './car-type-resolver.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    private readonly vinDecoder: VinDecoderService,
    private readonly maintenancePlanner: MaintenancePlannerService,
    private readonly carTypeResolver: CarTypeResolverService,
  ) {}

  async create(dto: CreateCarDto, userId: number) {
    const normalizedUserId = Number(userId);

    if (!Number.isFinite(normalizedUserId)) {
      throw new BadRequestException('Invalid user');
    }

    const vinData = await this.vinDecoder.decode(dto.vin);
    const inferredType =
      dto.type ??
      (await this.carTypeResolver.resolveFromVinData({
        make: vinData?.make,
        model: vinData?.model,
        bodyClass: vinData?.bodyClass,
      }));

    const car = this.carRepo.create({
      vin: dto.vin,
      brand: dto.brand ?? vinData?.make ?? 'Unknown',
      model: dto.model ?? vinData?.model ?? 'Unknown',
      year:
        dto.year ??
        (vinData?.modelYear ? Number(vinData.modelYear) : undefined),
      mileage: dto.mileage,
      annualMileage: dto.annualMileage,
      type: inferredType,
      vinDecodedData: vinData ?? undefined,
      user: { id: normalizedUserId } as User,
      lastMileageUpdate: new Date(),
    });

    try {
      const savedCar = await this.carRepo.save(car);
      await this.maintenancePlanner.initializeTasksForCar(savedCar);

      return savedCar;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === '23505'
      ) {
        throw new BadRequestException('Car with this VIN already exists');
      }

      throw error;
    }
  }

  findMyCars(userId: number) {
    return this.carRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string, userId: number) {
    return this.carRepo.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });
  }

  async update(id: string, dto: Partial<CreateCarDto>, userId: number) {
    const car = await this.carRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!car) throw new NotFoundException('Car not found');

    if (typeof dto.mileage === 'number') {
      car.lastMileageUpdate = new Date();
    }

    Object.assign(car, {
      brand: dto.brand ?? car.brand,
      model: dto.model ?? car.model,
      year: dto.year ?? car.year,
      mileage:
        typeof dto.mileage === 'number' ? dto.mileage : car.mileage,
      annualMileage: dto.annualMileage ?? car.annualMileage,
      type: dto.type ?? car.type,
    });

    const saved = await this.carRepo.save(car);
    await this.maintenancePlanner.updateCarNextMaintenance(saved.id);

    return saved;
  }

  async remove(id: string, userId: number) {
    await this.carRepo.delete({
      id,
      user: { id: userId },
    });
  }
}
