import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { Service, ServiceHealth, EventBus } from '@ops-board/shared-ui'
import { ServiceRepository } from './service.repository'

export interface HealthSummary {
  total: number
  healthy: number
  degraded: number
  down: number
  healthyPercent: number
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements OnDestroy {
  private readonly destroy$ = new Subject<void>()

  private readonly rawServices$ = new BehaviorSubject<Service[]>([])
  private readonly selectedServiceSubject = new BehaviorSubject<Service | null>(
    null
  )
  private readonly healthFilterSubject = new BehaviorSubject<
    ServiceHealth | 'all'
  >('all')
  private readonly searchTermSubject = new BehaviorSubject<string>('')

  readonly selectedService$: Observable<Service | null> =
    this.selectedServiceSubject.asObservable()
  readonly healthFilter$: Observable<ServiceHealth | 'all'> =
    this.healthFilterSubject.asObservable()
  readonly searchTerm$: Observable<string> =
    this.searchTermSubject.asObservable()

  readonly filteredServices$: Observable<Service[]> = combineLatest([
    this.rawServices$,
    this.healthFilter$,
    this.searchTerm$
  ]).pipe(
    map(([services, health, search]) => {
      let result = [...services]

      if (health !== 'all') {
        result = result.filter((s) => s.health === health)
      }

      if (search && search.trim()) {
        const term = search.toLowerCase().trim()
        result = result.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.description.toLowerCase().includes(term) ||
            s.ownerTeam.toLowerCase().includes(term) ||
            s.version.toLowerCase().includes(term)
        )
      }

      return result
    })
  )

  readonly healthSummary$: Observable<HealthSummary> = this.rawServices$.pipe(
    map((services) => {
      const total = services.length
      const healthy = services.filter((s) => s.health === 'healthy').length
      const degraded = services.filter((s) => s.health === 'degraded').length
      const down = services.filter((s) => s.health === 'down').length
      const healthyPercent =
        total > 0 ? Math.round((healthy / total) * 100) : 100

      return { total, healthy, degraded, down, healthyPercent }
    })
  )

  constructor(
    private repository: ServiceRepository,
    private eventBus: EventBus
  ) {
    this.loadServices()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadServices(): void {
    this.repository
      .getServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe((services) => {
        this.rawServices$.next(services)
      })
  }

  setHealthFilter(filter: ServiceHealth | 'all'): void {
    this.healthFilterSubject.next(filter)
  }

  setSearchTerm(search: string): void {
    this.searchTermSubject.next(search)
  }

  selectService(service: Service | null): void {
    this.selectedServiceSubject.next(service)
  }

  /**
   * Selects service and broadcasts service:selected event to cross-MFE EventBus
   */
  broadcastServiceSelected(service: Service): void {
    this.selectService(service)
    this.eventBus.emit('service:selected', {
      serviceId: service.id,
      serviceName: service.name
    })
  }
}
