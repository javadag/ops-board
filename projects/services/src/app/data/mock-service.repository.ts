import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { Service } from '@ops-board/shared-ui'
import { ServiceRepository } from './service.repository'

export const MOCK_SERVICES: Service[] = [
  {
    id: 'svc-payments',
    name: 'Payment Gateway',
    description:
      'Processes credit cards, SEPA, Apple Pay, and digital wallet authorizations.',
    health: 'degraded',
    uptime: 99.12,
    errorRate: 12.4,
    latencyP99: 1420,
    version: 'v2.14.1',
    ownerTeam: 'Payments Core',
    tier: 'tier-1',
    activeIncidentCount: 1,
    lastDeployment: {
      id: 'dep-904',
      version: 'v2.14.1',
      deployedAt: '2026-09-25T15:30:00Z',
      deployedBy: 'CI/CD Pipeline #4812',
      status: 'successful',
      commitSha: 'a89c2b4'
    },
    dependencies: [
      {
        id: 'svc-auth',
        name: 'Auth Service',
        type: 'upstream',
        health: 'degraded',
        protocol: 'gRPC'
      },
      {
        id: 'db-pg',
        name: 'PostgreSQL RDS Cluster',
        type: 'downstream',
        health: 'down',
        protocol: 'PostgreSQL'
      },
      {
        id: 'svc-notify',
        name: 'Notification Service',
        type: 'downstream',
        health: 'healthy',
        protocol: 'Kafka'
      }
    ]
  },
  {
    id: 'svc-auth',
    name: 'Auth Service',
    description:
      'Central OAuth 2.1 & OpenID Connect identity provider, session management & token verification.',
    health: 'degraded',
    uptime: 99.78,
    errorRate: 1.8,
    latencyP99: 480,
    version: 'v4.8.0',
    ownerTeam: 'Identity & Access',
    tier: 'tier-1',
    activeIncidentCount: 1,
    lastDeployment: {
      id: 'dep-892',
      version: 'v4.8.0',
      deployedAt: '2026-09-25T10:15:00Z',
      deployedBy: 'Elena Rostova',
      status: 'successful',
      commitSha: 'f34e191'
    },
    dependencies: [
      {
        id: 'cache-redis',
        name: 'Redis Token Cache',
        type: 'downstream',
        health: 'healthy',
        protocol: 'Redis'
      },
      {
        id: 'db-auth',
        name: 'PostgreSQL User DB',
        type: 'downstream',
        health: 'healthy',
        protocol: 'PostgreSQL'
      }
    ]
  },
  {
    id: 'svc-orders',
    name: 'Order Processing',
    description:
      'Orchestrates checkout transactions, cart checkout, and saga state machines.',
    health: 'healthy',
    uptime: 99.98,
    errorRate: 0.05,
    latencyP99: 145,
    version: 'v3.2.0',
    ownerTeam: 'Order Platform',
    tier: 'tier-1',
    activeIncidentCount: 0,
    lastDeployment: {
      id: 'dep-885',
      version: 'v3.2.0',
      deployedAt: '2026-09-24T14:00:00Z',
      deployedBy: 'David Chen',
      status: 'successful',
      commitSha: '9b201dc'
    },
    dependencies: [
      {
        id: 'svc-payments',
        name: 'Payment Gateway',
        type: 'downstream',
        health: 'degraded',
        protocol: 'gRPC'
      },
      {
        id: 'svc-inventory',
        name: 'Inventory Management',
        type: 'downstream',
        health: 'healthy',
        protocol: 'gRPC'
      },
      {
        id: 'kafka-bus',
        name: 'Kafka Event Bus',
        type: 'downstream',
        health: 'healthy',
        protocol: 'Kafka'
      }
    ]
  },
  {
    id: 'svc-notify',
    name: 'Notification Service',
    description:
      'Multi-channel messaging service for transactional SMS, push notifications, and emails.',
    health: 'healthy',
    uptime: 99.96,
    errorRate: 0.02,
    latencyP99: 85,
    version: 'v1.18.2',
    ownerTeam: 'Customer Comms',
    tier: 'tier-2',
    activeIncidentCount: 0,
    lastDeployment: {
      id: 'dep-879',
      version: 'v1.18.2',
      deployedAt: '2026-09-24T20:00:00Z',
      deployedBy: 'Elena Rostova',
      status: 'successful',
      commitSha: '63d09f2'
    },
    dependencies: [
      {
        id: 'svc-auth',
        name: 'Auth Service',
        type: 'upstream',
        health: 'degraded',
        protocol: 'HTTP/REST'
      },
      {
        id: 'ext-sendgrid',
        name: 'Twilio SendGrid API',
        type: 'downstream',
        health: 'healthy',
        protocol: 'HTTP/REST'
      }
    ]
  },
  {
    id: 'svc-search',
    name: 'Search Service',
    description:
      'Full-text query expansion, fuzzy matching, and catalogue search index.',
    health: 'healthy',
    uptime: 99.99,
    errorRate: 0.01,
    latencyP99: 45,
    version: 'v5.1.0',
    ownerTeam: 'Search & Discovery',
    tier: 'tier-1',
    activeIncidentCount: 0,
    lastDeployment: {
      id: 'dep-860',
      version: 'v5.1.0',
      deployedAt: '2026-09-24T11:00:00Z',
      deployedBy: 'David Chen',
      status: 'successful',
      commitSha: 'e201bb8'
    },
    dependencies: [
      {
        id: 'cluster-es',
        name: 'Elasticsearch 8.14 Cluster',
        type: 'downstream',
        health: 'healthy',
        protocol: 'HTTP/REST'
      }
    ]
  },
  {
    id: 'svc-inventory',
    name: 'Inventory Management',
    description:
      'Stock tracking, warehouse reservations, and backorder inventory queues.',
    health: 'healthy',
    uptime: 99.99,
    errorRate: 0.03,
    latencyP99: 68,
    version: 'v2.6.4',
    ownerTeam: 'Fulfillment Logistics',
    tier: 'tier-2',
    activeIncidentCount: 0,
    lastDeployment: {
      id: 'dep-845',
      version: 'v2.6.4',
      deployedAt: '2026-09-23T16:20:00Z',
      deployedBy: 'Alex Mercer',
      status: 'successful',
      commitSha: '7aa104d'
    },
    dependencies: [
      {
        id: 'db-inventory',
        name: 'MySQL High-Availability Node',
        type: 'downstream',
        health: 'healthy',
        protocol: 'PostgreSQL'
      }
    ]
  }
]

@Injectable({
  providedIn: 'root'
})
export class MockServiceRepository implements ServiceRepository {
  private services = [...MOCK_SERVICES]

  getServices(): Observable<Service[]> {
    return of(this.services).pipe(delay(40))
  }

  getServiceById(id: string): Observable<Service | undefined> {
    const found = this.services.find(
      (s) =>
        s.id.toLowerCase() === id.toLowerCase() ||
        s.name.toLowerCase() === id.toLowerCase()
    )
    return of(found ? { ...found } : undefined).pipe(delay(20))
  }
}
