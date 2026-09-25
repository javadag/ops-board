import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import {
  Incident,
  IncidentFilterOptions,
  IncidentSeverity,
  IncidentStatus,
  EventBus,
  ServiceSelectedPayload
} from '@ops-board/shared-ui'
import { IncidentRepository } from './incident.repository'

const DEFAULT_FILTERS: IncidentFilterOptions = {
  search: '',
  status: 'ALL',
  severity: 'ALL',
  service: 'ALL',
  sortBy: 'startTime',
  sortOrder: 'desc'
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService implements OnDestroy {
  private readonly destroy$ = new Subject<void>()

  private readonly rawIncidents$ = new BehaviorSubject<Incident[]>([])
  private readonly filtersSubject = new BehaviorSubject<IncidentFilterOptions>(
    DEFAULT_FILTERS
  )
  private readonly selectedIncidentSubject =
    new BehaviorSubject<Incident | null>(null)

  readonly filters$: Observable<IncidentFilterOptions> =
    this.filtersSubject.asObservable()
  readonly selectedIncident$: Observable<Incident | null> =
    this.selectedIncidentSubject.asObservable()

  readonly filteredIncidents$: Observable<Incident[]> = combineLatest([
    this.rawIncidents$,
    this.filters$
  ]).pipe(
    map(([incidents, filters]) => this.applyFiltersAndSort(incidents, filters))
  )

  constructor(
    private repository: IncidentRepository,
    private eventBus: EventBus
  ) {
    this.loadIncidents()
    this.listenToCrossMfeEvents()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadIncidents(): void {
    this.repository
      .getIncidents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((incidents) => {
        this.rawIncidents$.next(incidents)
      })
  }

  setSearch(search: string): void {
    this.updateFilters({ search })
  }

  setStatus(status: IncidentStatus | 'ALL'): void {
    this.updateFilters({ status })
  }

  setSeverity(severity: IncidentSeverity | 'ALL'): void {
    this.updateFilters({ severity })
  }

  setService(service: string | 'ALL'): void {
    this.updateFilters({ service })
  }

  setSorting(
    sortBy: 'startTime' | 'severity' | 'status' | 'title',
    sortOrder: 'asc' | 'desc'
  ): void {
    this.updateFilters({ sortBy, sortOrder })
  }

  resetFilters(): void {
    this.filtersSubject.next(DEFAULT_FILTERS)
  }

  selectIncident(incident: Incident | null): void {
    this.selectedIncidentSubject.next(incident)
    if (incident) {
      this.eventBus.emit('incident:selected', {
        incidentId: incident.id,
        severity: incident.severity,
        service: incident.affectedService
      })
    }
  }

  selectIncidentById(id: string): void {
    const found = this.rawIncidents$.value.find((i) => i.id === id)
    if (found) {
      this.selectIncident(found)
    } else {
      this.repository.getIncidentById(id).subscribe((incident) => {
        this.selectIncident(incident || null)
      })
    }
  }

  getIncidentById(id: string): Observable<Incident | undefined> {
    return this.repository.getIncidentById(id)
  }

  private updateFilters(partial: Partial<IncidentFilterOptions>): void {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...partial
    })
  }

  private listenToCrossMfeEvents(): void {
    // When Services MFE emits service:selected, filter Incidents by that service
    this.eventBus
      .on<ServiceSelectedPayload>('service:selected')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event?.serviceName) {
          this.setService(event.serviceName)
        }
      })
  }

  private applyFiltersAndSort(
    incidents: Incident[],
    filters: IncidentFilterOptions
  ): Incident[] {
    let result = [...incidents]

    // Search filter
    if (filters.search && filters.search.trim()) {
      const term = filters.search.toLowerCase().trim()
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(term) ||
          i.title.toLowerCase().includes(term) ||
          i.summary.toLowerCase().includes(term) ||
          i.affectedService.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((i) => i.status === filters.status)
    }

    // Severity filter
    if (filters.severity && filters.severity !== 'ALL') {
      result = result.filter((i) => i.severity === filters.severity)
    }

    // Service filter
    if (filters.service && filters.service !== 'ALL') {
      result = result.filter(
        (i) =>
          i.affectedService.toLowerCase() === filters.service!.toLowerCase()
      )
    }

    // Sorting
    const sortBy = filters.sortBy || 'startTime'
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1

    result.sort((a, b) => {
      if (sortBy === 'startTime') {
        return (
          (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) *
          sortOrder
        )
      }
      if (sortBy === 'severity') {
        const severityRank: Record<string, number> = {
          P1: 4,
          P2: 3,
          P3: 2,
          P4: 1
        }
        const rankA = severityRank[a.severity] || 0
        const rankB = severityRank[b.severity] || 0
        return (rankA - rankB) * sortOrder
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status) * sortOrder
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * sortOrder
      }
      return 0
    })

    return result
  }
}
