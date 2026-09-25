export type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4'

export type IncidentStatus =
  'Investigating' | 'Identified' | 'Monitoring' | 'Resolved'

export interface TimelineEvent {
  id: string
  timestamp: string
  status: IncidentStatus
  summary: string
  author: string
  details?: string
  actionTaken?: string
}

export interface Incident {
  id: string
  title: string
  severity: IncidentSeverity
  status: IncidentStatus
  affectedService: string
  startTime: string
  resolvedTime?: string
  assignedTeam: string
  leadResponder: string
  summary: string
  impact: string
  timeline: TimelineEvent[]
}

export interface IncidentFilterOptions {
  search?: string
  status?: IncidentStatus | 'ALL'
  severity?: IncidentSeverity | 'ALL'
  service?: string | 'ALL'
  sortBy?: 'startTime' | 'severity' | 'status' | 'title'
  sortOrder?: 'asc' | 'desc'
}
