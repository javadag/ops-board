import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { Incident } from '@ops-board/shared-ui'
import { IncidentRepository } from './incident.repository'

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-4091',
    title: 'Payment Gateway PostgreSQL Connection Pool Exhaustion',
    severity: 'P1',
    status: 'Investigating',
    affectedService: 'Payment Gateway',
    startTime: '2026-09-25T16:15:00Z',
    assignedTeam: 'Payments Core',
    leadResponder: 'Alex Mercer (SRE Lead)',
    summary:
      'Elevated checkout failure rate (>12%) caused by connection leak in checkout worker pods.',
    impact:
      'Users experiencing payment processing timeouts and 504 Gateway errors during checkout flow.',
    timeline: [
      {
        id: 'TL-101',
        timestamp: '2026-09-25T16:15:00Z',
        status: 'Investigating',
        summary:
          'Datadog alert: Payment Gateway error rate > 5% for 3 consecutive minutes.',
        author: 'Monitoring (Datadog)',
        details:
          'Threshold breached: checkout_error_ratio = 12.4% on cluster us-east-1.'
      },
      {
        id: 'TL-102',
        timestamp: '2026-09-25T16:18:00Z',
        status: 'Investigating',
        summary: 'P1 incident declared; SRE on-call paged via PagerDuty.',
        author: 'Alex Mercer',
        details:
          'Initial triage points to PostgreSQL pg_stat_activity showing 400/400 active client connections.',
        actionTaken: 'Opened incident bridge #incident-4091 on Slack.'
      },
      {
        id: 'TL-103',
        timestamp: '2026-09-25T16:26:00Z',
        status: 'Identified',
        summary:
          'Root cause identified: recent v2.14.1 deployment missing connection release in refund webhook.',
        author: 'Elena Rostova',
        details:
          'Unclosed db connections accumulating indefinitely under webhook retry loop.',
        actionTaken: 'Preparing hotfix and temporary pool scaling on RDS proxy.'
      }
    ]
  },
  {
    id: 'INC-4089',
    title: 'OAuth Token Validation Latency Spike',
    severity: 'P2',
    status: 'Monitoring',
    affectedService: 'Auth Service',
    startTime: '2026-09-25T14:40:00Z',
    assignedTeam: 'Identity & Access',
    leadResponder: 'Elena Rostova',
    summary:
      'P99 authentication response time degraded from 22ms to 480ms due to key rotation cache misses.',
    impact:
      'Intermittent slow page loads across customer portal during session refresh.',
    timeline: [
      {
        id: 'TL-201',
        timestamp: '2026-09-25T14:40:00Z',
        status: 'Investigating',
        summary: 'High latency alert triggered on /oauth/token endpoint.',
        author: 'Monitoring',
        details: 'P99 latency spiked to 480ms.'
      },
      {
        id: 'TL-202',
        timestamp: '2026-09-25T14:55:00Z',
        status: 'Identified',
        summary: 'JWKS public key fetching failing cache lookups.',
        author: 'David Chen',
        actionTaken: 'Warmed up Redis JWKS cache manually.'
      },
      {
        id: 'TL-203',
        timestamp: '2026-09-25T15:10:00Z',
        status: 'Monitoring',
        summary: 'Latency dropped to 28ms; monitoring recovery.',
        author: 'Elena Rostova'
      }
    ]
  },
  {
    id: 'INC-4085',
    title: 'Redis Cluster Memory Pressure & Thundering Herd',
    severity: 'P2',
    status: 'Monitoring',
    affectedService: 'Order Processing',
    startTime: '2026-09-25T12:00:00Z',
    assignedTeam: 'Order Platform',
    leadResponder: 'David Chen',
    summary:
      'TTL synchronization caused simultaneous key evictions, overwhelming database fallback queries.',
    impact: 'Order placement latency elevated by 200ms.',
    timeline: [
      {
        id: 'TL-301',
        timestamp: '2026-09-25T12:00:00Z',
        status: 'Investigating',
        summary: 'Cache hit ratio dropped from 96% to 64%.',
        author: 'Monitoring'
      },
      {
        id: 'TL-302',
        timestamp: '2026-09-25T12:20:00Z',
        status: 'Identified',
        summary: 'Synchronized midnight TTL expiry led to thundering herd.',
        author: 'David Chen',
        actionTaken: 'Added random jitter (±15%) to TTL calculation.'
      },
      {
        id: 'TL-303',
        timestamp: '2026-09-25T12:45:00Z',
        status: 'Monitoring',
        summary: 'Cache hit ratio restored to 94%.',
        author: 'Alex Mercer'
      }
    ]
  },
  {
    id: 'INC-4078',
    title: 'Kafka Consumer Group Lag on Order Events Topic',
    severity: 'P3',
    status: 'Resolved',
    affectedService: 'Notification Service',
    startTime: '2026-09-24T18:30:00Z',
    resolvedTime: '2026-09-24T19:45:00Z',
    assignedTeam: 'Customer Comms',
    leadResponder: 'Elena Rostova',
    summary:
      'Consumer partition rebalance loop delayed order confirmation emails by up to 25 minutes.',
    impact: 'Delayed order confirmation notifications for ~1,200 orders.',
    timeline: [
      {
        id: 'TL-401',
        timestamp: '2026-09-24T18:30:00Z',
        status: 'Investigating',
        summary: 'Consumer lag exceeded 50,000 messages.',
        author: 'Monitoring'
      },
      {
        id: 'TL-402',
        timestamp: '2026-09-24T18:50:00Z',
        status: 'Identified',
        summary:
          'Heartbeat timeout too low during batch email template generation.',
        author: 'Elena Rostova',
        actionTaken:
          'Increased max.poll.interval.ms from 30s to 120s and scaled consumer replicas to 6.'
      },
      {
        id: 'TL-403',
        timestamp: '2026-09-24T19:45:00Z',
        status: 'Resolved',
        summary: 'Lag drained to 0. All delayed notifications dispatched.',
        author: 'Elena Rostova'
      }
    ]
  },
  {
    id: 'INC-4062',
    title: 'Elasticsearch Index Shard Allocation Failure',
    severity: 'P3',
    status: 'Resolved',
    affectedService: 'Search Service',
    startTime: '2026-09-24T09:15:00Z',
    resolvedTime: '2026-09-24T10:30:00Z',
    assignedTeam: 'Search & Discovery',
    leadResponder: 'David Chen',
    summary:
      'Disk high watermark exceeded on node data-03 causing unassigned replica shards.',
    impact:
      'Search queries fell back to primary shards only, minor latency increase.',
    timeline: [
      {
        id: 'TL-501',
        timestamp: '2026-09-24T09:15:00Z',
        status: 'Investigating',
        summary: 'Elasticsearch cluster health status turned YELLOW.',
        author: 'Monitoring'
      },
      {
        id: 'TL-502',
        timestamp: '2026-09-24T09:35:00Z',
        status: 'Identified',
        summary:
          'Node data-03 disk utilization reached 88% (flood-stage threshold).',
        author: 'David Chen',
        actionTaken:
          'Pruned indices older than 90 days and expanded EBS volume from 500GB to 1TB.'
      },
      {
        id: 'TL-503',
        timestamp: '2026-09-24T10:30:00Z',
        status: 'Resolved',
        summary: 'Cluster status GREEN. All shards allocated.',
        author: 'David Chen'
      }
    ]
  },
  {
    id: 'INC-4050',
    title: 'CDN Edge SSL Certificate Expiry Warning',
    severity: 'P4',
    status: 'Resolved',
    affectedService: 'Static Web Assets',
    startTime: '2026-09-23T11:00:00Z',
    resolvedTime: '2026-09-23T11:45:00Z',
    assignedTeam: 'DevOps Edge',
    leadResponder: 'Alex Mercer',
    summary:
      'Automated Let’s Encrypt renewal script failed DNS-01 challenge for secondary domain.',
    impact:
      'Zero customer downtime; certificate had 7 days remaining before expiration.',
    timeline: [
      {
        id: 'TL-601',
        timestamp: '2026-09-23T11:00:00Z',
        status: 'Investigating',
        summary: 'Cert-manager alert: automated ACME renewal failed.',
        author: 'Monitoring'
      },
      {
        id: 'TL-602',
        timestamp: '2026-09-23T11:20:00Z',
        status: 'Identified',
        summary: 'Cloudflare API token expired.',
        author: 'Alex Mercer',
        actionTaken:
          'Rotated API credential in HashiCorp Vault and re-triggered ACME challenge.'
      },
      {
        id: 'TL-603',
        timestamp: '2026-09-23T11:45:00Z',
        status: 'Resolved',
        summary: 'Certificate issued successfully for next 90 days.',
        author: 'Alex Mercer'
      }
    ]
  }
]

@Injectable({
  providedIn: 'root'
})
export class MockIncidentRepository implements IncidentRepository {
  private incidents = [...MOCK_INCIDENTS]

  getIncidents(): Observable<Incident[]> {
    // Return observable with realistic async delay
    return of(this.incidents).pipe(delay(40))
  }

  getIncidentById(id: string): Observable<Incident | undefined> {
    const found = this.incidents.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    )
    return of(found ? { ...found } : undefined).pipe(delay(20))
  }
}
