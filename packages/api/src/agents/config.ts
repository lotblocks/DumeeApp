import { EModelEndpoint, agentsEndpointSchema } from 'dumee-data-provider';
import type { TCustomConfig, TAgentsEndpoint } from 'dumee-data-provider';

/**
 * Sets up the Agents configuration from the config (`Dumee.yaml`) file.
 * If no agents config is defined, uses the provided defaults or parses empty object.
 *
 * @param config - The loaded custom configuration.
 * @param [defaultConfig] - Default configuration from getConfigDefaults.
 * @returns The Agents endpoint configuration.
 */
export function agentsConfigSetup(
  config: TCustomConfig,
  defaultConfig: Partial<TAgentsEndpoint>,
): Partial<TAgentsEndpoint> {
  const agentsConfig = config?.endpoints?.[EModelEndpoint.agents];

  if (!agentsConfig) {
    return defaultConfig || agentsEndpointSchema.parse({});
  }

  const parsedConfig = agentsEndpointSchema.parse(agentsConfig);
  return parsedConfig;
}

