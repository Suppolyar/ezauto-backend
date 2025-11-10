import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly providerUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.providerUrl = this.configService.get<string>('PUSH_PROVIDER_URL', '');
  }

  async send(
    tokens: string[],
    message: PushMessage,
  ): Promise<{ success: boolean }> {
    if (!tokens.length) {
      return { success: false };
    }

    try {
      const payload = tokens.map((token) => ({
        to: token,
        title: message.title,
        body: message.body,
        data: message.data ?? {},
      }));

      const response = await fetch(this.providerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.warn(`Push provider error: ${response.status}`);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Push send failed: ${(error as Error).message}`);
      return { success: false };
    }
  }
}
