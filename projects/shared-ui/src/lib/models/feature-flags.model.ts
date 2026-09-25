export interface FeatureFlags {
  incidentReplay: boolean
  serviceDependencies: boolean
  analytics: boolean
  autoRefresh: boolean
  [key: string]: boolean
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  incidentReplay: true,
  serviceDependencies: true,
  analytics: false,
  autoRefresh: true
}
