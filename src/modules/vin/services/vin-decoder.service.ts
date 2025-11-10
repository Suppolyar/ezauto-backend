import { Injectable, Logger } from '@nestjs/common';

export interface VinDecodedData {
  [key: string]: string | undefined;
  vin: string;
  make?: string;
  model?: string;
  modelYear?: string;
  bodyClass?: string;
  driveType?: string;
  fuelTypePrimary?: string;
}

@Injectable()
export class VinDecoderService {
  private readonly logger = new Logger(VinDecoderService.name);
  private readonly baseUrl =
    'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended';

  async decode(vin: string): Promise<VinDecodedData | null> {
    const url = `${this.baseUrl}/${encodeURIComponent(vin)}?format=json`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        this.logger.warn(`VIN decode failed with status ${response.status}`);
        return null;
      }

      const json = (await response.json()) as {
        Results?: Array<Record<string, string>>;
      };

      const payload = json.Results?.[0];

      if (!payload) {
        return null;
      }

      return {
        vin,
        make: payload.Make,
        model: payload.Model,
        modelYear: payload.ModelYear,
        bodyClass: payload.BodyClass,
        driveType: payload.DriveType,
        fuelTypePrimary: payload.FuelTypePrimary,
      };
    } catch (error) {
      this.logger.error(`VIN decode error: ${(error as Error).message}`);
      return null;
    }
  }
}
