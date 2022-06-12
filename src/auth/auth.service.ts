import { Injectable } from '@nestjs/common';
import { ApiKeys } from '../config';
@Injectable()
export class AuthService {
  // KEYS
  private apiKeys: string[] = ApiKeys;

  validateApiKey(apiKey: string) {
    return this.apiKeys.find((apiK) => apiKey === apiK);
  }
}
