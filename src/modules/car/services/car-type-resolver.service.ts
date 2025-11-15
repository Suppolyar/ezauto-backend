import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarTypeRule } from '../../../entities/car-type-rule.entity';

type NormalizedVinPayload = {
  make: string;
  model: string;
  bodyClass: string;
};

@Injectable()
export class CarTypeResolverService {
  private readonly logger = new Logger(CarTypeResolverService.name);
  private cachedRules: CarTypeRule[] | null = null;
  private cacheExpiresAt = 0;
  private readonly cacheTtlMs = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(CarTypeRule)
    private readonly rulesRepo: Repository<CarTypeRule>,
  ) {}

  async resolveFromVinData(params: {
    make?: string | null;
    model?: string | null;
    bodyClass?: string | null;
  }): Promise<'base' | 'sport' | 'luxury'> {
    const normalized = this.normalizePayload(params);
    const rules = await this.getRules();

    for (const rule of rules) {
      if (this.matchesRule(rule, normalized)) {
        return rule.carType;
      }
    }

    return this.basicFallbackFromPayload(normalized);
  }

  private async getRules(): Promise<CarTypeRule[]> {
    const now = Date.now();

    if (this.cachedRules && now < this.cacheExpiresAt) {
      return this.cachedRules;
    }

    try {
      const rules = await this.rulesRepo.find({
        order: {
          priority: 'ASC',
          id: 'ASC',
        },
      });

      this.cachedRules = rules;
      this.cacheExpiresAt = now + this.cacheTtlMs;
    } catch (error) {
      this.logger.warn(
        `Failed to load car type rules: ${(error as Error).message}`,
      );
      this.cachedRules = [];
      this.cacheExpiresAt = now + 30_000;
    }

    return this.cachedRules ?? [];
  }

  private matchesRule(
    rule: CarTypeRule,
    payload: NormalizedVinPayload,
  ): boolean {
    if (
      rule.makePattern &&
      !payload.make.includes(rule.makePattern.toLowerCase())
    ) {
      return false;
    }

    if (
      rule.modelPattern &&
      !payload.model.includes(rule.modelPattern.toLowerCase())
    ) {
      return false;
    }

    if (
      rule.bodyClassPattern &&
      !payload.bodyClass.includes(rule.bodyClassPattern.toLowerCase())
    ) {
      return false;
    }

    return Boolean(
      rule.makePattern || rule.modelPattern || rule.bodyClassPattern,
    );
  }

  private normalizePayload(payload: {
    make?: string | null;
    model?: string | null;
    bodyClass?: string | null;
  }): NormalizedVinPayload {
    return {
      make: payload.make?.toLowerCase().trim() ?? '',
      model: payload.model?.toLowerCase().trim() ?? '',
      bodyClass: payload.bodyClass?.toLowerCase().trim() ?? '',
    };
  }

  private basicFallbackFromPayload(
    payload: NormalizedVinPayload,
  ): 'base' | 'sport' | 'luxury' {
    if (payload.bodyClass.includes('sport')) {
      return 'sport';
    }

    if (payload.bodyClass.includes('luxury')) {
      return 'luxury';
    }

    return 'base';
  }
}
