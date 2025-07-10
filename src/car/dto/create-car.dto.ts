import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString()
  vin!: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsNumber()
  year!: number;

  @IsNumber()
  mileage!: number;

  @IsNumber()
  averageMileagePerYear!: number;

  @IsOptional()
  @IsString()
  userId?: string;
}
