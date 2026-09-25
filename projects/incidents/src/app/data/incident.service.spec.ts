import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { IncidentService } from './incident.service'
import { IncidentRepository } from './incident.repository'
import { EventBus } from '@ops-board/shared-ui'
import { MOCK_INCIDENTS } from './mock-incident.repository'

describe('IncidentService', () => {
  let service: IncidentService
  let mockRepo: Partial<IncidentRepository>
  let eventBus: EventBus

  beforeEach(() => {
    mockRepo = {
      getIncidents: () => of([...MOCK_INCIDENTS]),
      getIncidentById: (id: string) =>
        of(MOCK_INCIDENTS.find((i) => i.id === id))
    }

    eventBus = new EventBus()

    TestBed.configureTestingModule({
      providers: [
        IncidentService,
        { provide: IncidentRepository, useValue: mockRepo },
        { provide: EventBus, useValue: eventBus }
      ]
    })

    service = TestBed.inject(IncidentService)
  })

  it('should load all incidents initially', (done) => {
    service.filteredIncidents$.subscribe((incidents) => {
      expect(incidents.length).toBe(MOCK_INCIDENTS.length)
      done()
    })
  })

  it('should filter incidents by search term', (done) => {
    service.setSearch('PostgreSQL')

    service.filteredIncidents$.subscribe((incidents) => {
      expect(incidents.length).toBe(1)
      expect(incidents[0].id).toBe('INC-4091')
      done()
    })
  })

  it('should filter incidents by severity', (done) => {
    service.setSeverity('P1')

    service.filteredIncidents$.subscribe((incidents) => {
      expect(incidents.every((i) => i.severity === 'P1')).toBe(true)
      done()
    })
  })

  it('should filter incidents by status', (done) => {
    service.setStatus('Resolved')

    service.filteredIncidents$.subscribe((incidents) => {
      expect(incidents.every((i) => i.status === 'Resolved')).toBe(true)
      done()
    })
  })

  it('should update service filter when Cross-MFE service:selected event is received', (done) => {
    eventBus.emit('service:selected', {
      serviceId: 'svc-auth',
      serviceName: 'Auth Service'
    })

    service.filters$.subscribe((filters) => {
      if (filters.service === 'Auth Service') {
        expect(filters.service).toBe('Auth Service')
        done()
      }
    })
  })

  it('should emit incident:selected event when an incident is selected', (done) => {
    const targetIncident = MOCK_INCIDENTS[0]

    eventBus
      .on<{ incidentId: string }>('incident:selected')
      .subscribe((payload) => {
        expect(payload.incidentId).toBe(targetIncident.id)
        done()
      })

    service.selectIncident(targetIncident)
  })
})
