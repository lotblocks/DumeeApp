import type { AuthType } from 'dumee-data-provider';

export type ApiKeyFormData = {
  apiKey: string;
  authType?: string | AuthType;
};

