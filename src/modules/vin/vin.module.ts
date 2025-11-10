import { Module } from '@nestjs/common';
import { VinDecoderService } from './services/vin-decoder.service';

@Module({
  providers: [VinDecoderService],
  exports: [VinDecoderService],
})
export class VinModule {}
