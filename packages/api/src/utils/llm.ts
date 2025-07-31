import { Dumee } from 'dumee-data-provider';
import type { DynamicSettingProps } from 'dumee-data-provider';

type DumeeKeys = keyof typeof Dumee;

type DumeeParams = {
  modelOptions: Omit<NonNullable<DynamicSettingProps['conversation']>, DumeeKeys>;
  resendFiles: boolean;
  promptPrefix?: string | null;
  maxContextTokens?: number;
  modelLabel?: string | null;
};

/**
 * Separates Dumee-specific parameters from model options
 * @param options - The combined options object
 */
export function extractDumeeParams(
  options?: DynamicSettingProps['conversation'],
): DumeeParams {
  if (!options) {
    return {
      modelOptions: {} as Omit<NonNullable<DynamicSettingProps['conversation']>, DumeeKeys>,
      resendFiles: Dumee.resendFiles.default as boolean,
    };
  }

  const modelOptions = { ...options };

  const resendFiles =
    (delete modelOptions.resendFiles, options.resendFiles) ??
    (Dumee.resendFiles.default as boolean);
  const promptPrefix = (delete modelOptions.promptPrefix, options.promptPrefix);
  const maxContextTokens = (delete modelOptions.maxContextTokens, options.maxContextTokens);
  const modelLabel = (delete modelOptions.modelLabel, options.modelLabel);

  return {
    modelOptions: modelOptions as Omit<
      NonNullable<DynamicSettingProps['conversation']>,
      DumeeKeys
    >,
    maxContextTokens,
    promptPrefix,
    resendFiles,
    modelLabel,
  };
}

