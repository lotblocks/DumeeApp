﻿import { excludedKeys } from 'dumee-data-provider';
import { useGetModelsQuery } from 'dumee-data-provider/react-query';
import type {
  TEndpointsConfig,
  TModelsConfig,
  TConversation,
  TPreset,
} from 'dumee-data-provider';
import { getDefaultEndpoint, buildDefaultConvo } from '~/utils';
import { useGetEndpointsQuery } from '~/data-provider';

type TDefaultConvo = {
  conversation: Partial<TConversation>;
  preset?: Partial<TPreset> | null;
  cleanInput?: boolean;
  cleanOutput?: boolean;
};

const exceptions = new Set(['spec', 'iconURL']);

const useDefaultConvo = () => {
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();
  const { data: modelsConfig = {} as TModelsConfig } = useGetModelsQuery();

  const getDefaultConversation = ({
    conversation: _convo,
    preset,
    cleanInput,
    cleanOutput,
  }: TDefaultConvo) => {
    const endpoint = getDefaultEndpoint({
      convoSetup: preset as TPreset,
      endpointsConfig,
    });

    const models = modelsConfig[endpoint ?? ''] || [];
    const conversation = { ..._convo };
    if (cleanInput === true) {
      for (const key in conversation) {
        if (excludedKeys.has(key) && !exceptions.has(key)) {
          continue;
        }
        if (conversation[key] == null) {
          continue;
        }
        conversation[key] = undefined;
      }
    }

    const defaultConvo = buildDefaultConvo({
      conversation: conversation as TConversation,
      endpoint,
      lastConversationSetup: preset as TConversation,
      models,
    });

    if (!cleanOutput) {
      return defaultConvo;
    }

    for (const key in defaultConvo) {
      if (excludedKeys.has(key) && !exceptions.has(key)) {
        continue;
      }
      if (defaultConvo[key] == null) {
        continue;
      }
      defaultConvo[key] = undefined;
    }

    return defaultConvo;
  };

  return getDefaultConversation;
};

export default useDefaultConvo;

