﻿import { PermissionTypes, Permissions } from 'dumee-data-provider';
import useHasAccess from './Roles/useHasAccess';

export default function usePersonalizationAccess() {
  const hasMemoryOptOut = useHasAccess({
    permissionType: PermissionTypes.MEMORIES,
    permission: Permissions.OPT_OUT,
  });

  const hasAnyPersonalizationFeature = hasMemoryOptOut;

  return {
    hasMemoryOptOut,
    hasAnyPersonalizationFeature,
  };
}

