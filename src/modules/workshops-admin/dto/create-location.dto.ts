import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateWorkshopLocationDto {
  @ApiProperty()
  @IsString()
  @Length(2, 80)
  title!: string;

  @ApiProperty()
  @IsString()
  @Length(4, 200)
  address!: string;

  @ApiProperty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
