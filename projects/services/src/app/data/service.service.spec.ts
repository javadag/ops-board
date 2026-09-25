import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { ServiceService } from './service.service'
import { ServiceRepository } from './service.repository'
import { EventBus } from '@ops-board/shared-ui'
import { MOCK_SERVICES } from './mock-service.repository'

describe('ServiceService', () => {
  let service: ServiceService
  let mockRepo: Partial<ServiceRepository>
  let eventBus: EventBus

  beforeEach(() => {
    mockRepo = {
      getServices: () => of([...MOCK_SERVICES]),
      getServiceById: (id: string) => of(MOCK_SERVICES.find((s) => s.id === id))
    }

    eventBus = new EventBus()

    TestBed.configureTestingModule({
      providers: [
        ServiceService,
        { provide: ServiceRepository, useValue: mockRepo },
        { provide: EventBus, useValue: eventBus }
      ]
    })

    service = TestBed.inject(ServiceService)
  })

  it('should load all services initially', (done) => {
    service.filteredServices$.subscribe((services) => {
      expect(services.length).toBe(MOCK_SERVICES.length)
      done()
    })
  })

  it('should filter services by health status', (done) => {
    service.setHealthFilter('degraded')

    service.filteredServices$.subscribe((services) => {
      expect(services.every((s) => s.health === 'degraded')).toBe(true)
      done()
    })
  })

  it('should broadcast service:selected on EventBus', (done) => {
    const targetService = MOCK_SERVICES[0]

    eventBus
      .on<{ serviceId: string; serviceName: string }>('service:selected')
      .subscribe((event) => {
        expect(event.serviceId).toBe(targetService.id)
        expect(event.serviceName).toBe(targetService.name)
        done()
      })

    service.broadcastServiceSelected(targetService)
  })

  it('should calculate health summary accurately', (done) => {
    service.healthSummary$.subscribe((summary) => {
      expect(summary.total).toBe(MOCK_SERVICES.length)
      expect(summary.degraded).toBeGreaterThan(0)
      expect(summary.healthyPercent).toBeGreaterThan(0)
      done()
    })
  })
})
