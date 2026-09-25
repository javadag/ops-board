export type ServiceHealth = 'healthy' | 'degraded' | 'down'

export interface ServiceDeployment {
  id: string
  version: string
  deployedAt: string
  deployedBy: string
  status: 'successful' | 'failed' | 'in_progress'
  commitSha: string
}

export interface ServiceDependency {
  id: string
  name: string
  type: 'upstream' | 'downstream'
  health: ServiceHealth
  protocol: 'gRPC' | 'HTTP/REST' | 'Kafka' | 'PostgreSQL' | 'Redis'
}

export interface Service {
  id: string
  name: string
  description: string
  health: ServiceHealth
  uptime: number // e.g., 99.98
  errorRate: number // e.g., 0.04%
  latencyP99: number // ms, e.g., 120ms
  version: string
  ownerTeam: string
  tier: 'tier-1' | 'tier-2' | 'tier-3'
  lastDeployment: ServiceDeployment
  dependencies: ServiceDependency[]
  activeIncidentCount?: number
}
