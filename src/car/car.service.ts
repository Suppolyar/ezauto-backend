import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dto/create-car.dto';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  async create(dto: CreateCarDto, userId: string) {
    const car = this.carRepo.create({
      ...dto,
      user: { id: +userId }, // Приведение к числу, если User.id — number
    });
    return this.carRepo.save(car);
  }

  findMyCars(userId: string) {
    return this.carRepo.find({
      where: {
        user: { id: +userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.carRepo.findOne({
      where: {
        id,
        user: { id: +userId },
      },
    });
  }

  async update(id: string, dto: Partial<CreateCarDto>, userId: string) {
    const car = await this.carRepo.findOne({ where: { id, user: { id: +userId } } });
    if (!car) throw new Error('Car not found');
    Object.assign(car, dto);
    return this.carRepo.save(car);
  }

  async remove(id: string, userId: string) {
    await this.carRepo.delete({
      id,
      user: { id: +userId },
    });
  }
}
