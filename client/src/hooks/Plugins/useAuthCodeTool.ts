import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthType, Tools, QueryKeys } from 'dumee-data-provider';
import { useUpdateUserPluginsMutation } from 'dumee-data-provider/react-query';
// import { useToastContext } from '~/Providers';

const useAuthCodeTool = (options?: { isEntityTool: boolean }) => {
  // const { showToast } = useToastContext();
  const queryClient = useQueryClient();
  const isEntityTool = options?.isEntityTool ?? true;
  const updateUserPlugins = useUpdateUserPluginsMutation({
    onMutate: (vars) => {
      queryClient.setQueryData([QueryKeys.toolAuth, Tools.execute_code], () => ({
        authenticated: vars.action === 'install',
        message: AuthType.USER_PROVIDED,
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.toolAuth, Tools.execute_code]);
    },
    onError: () => {
      queryClient.invalidateQueries([QueryKeys.toolAuth, Tools.execute_code]);
    },
  });

  const installTool = useCallback(
    (apiKey: string) => {
      updateUserPlugins.mutate({
        pluginKey: Tools.execute_code,
        action: 'install',
        auth: { Dumee_CODE_API_KEY: apiKey },
        isEntityTool,
      });
    },
    [updateUserPlugins, isEntityTool],
  );

  const removeTool = useCallback(() => {
    updateUserPlugins.mutate({
      pluginKey: Tools.execute_code,
      action: 'uninstall',
      auth: { Dumee_CODE_API_KEY: null },
      isEntityTool,
    });
  }, [updateUserPlugins, isEntityTool]);

  return {
    removeTool,
    installTool,
  };
};

export default useAuthCodeTool;

