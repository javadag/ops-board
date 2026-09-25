import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { IncidentFiltersComponent } from './incident-filters.component'
import { IncidentService } from '../../data/incident.service'
import { IncidentRepository } from '../../data/incident.repository'
import { EventBus } from '@ops-board/shared-ui'
import { MOCK_INCIDENTS } from '../../data/mock-incident.repository'

describe('IncidentFiltersComponent', () => {
  let component: IncidentFiltersComponent
  let fixture: ComponentFixture<IncidentFiltersComponent>
  let incidentService: IncidentService

  beforeEach(async () => {
    const mockRepo: Partial<IncidentRepository> = {
      getIncidents: () => of([...MOCK_INCIDENTS]),
      getIncidentById: (id: string) =>
        of(MOCK_INCIDENTS.find((i) => i.id === id))
    }

    await TestBed.configureTestingModule({
      imports: [IncidentFiltersComponent],
      providers: [
        IncidentService,
        { provide: IncidentRepository, useValue: mockRepo },
        { provide: EventBus, useValue: new EventBus() }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(IncidentFiltersComponent)
    component = fixture.componentInstance
    incidentService = TestBed.inject(IncidentService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should update search term on input change', (done) => {
    component.onSearchChange('payment')

    incidentService.filters$.subscribe((filters) => {
      expect(filters.search).toBe('payment')
      done()
    })
  })

  it('should update status on status pill click', (done) => {
    component.onStatusClick('Investigating')

    incidentService.filters$.subscribe((filters) => {
      expect(filters.status).toBe('Investigating')
      done()
    })
  })

  it('should update severity on severity pill click', (done) => {
    component.onSeverityClick('P1')

    incidentService.filters$.subscribe((filters) => {
      expect(filters.severity).toBe('P1')
      done()
    })
  })

  it('should reset all filters', (done) => {
    component.onSeverityClick('P2')
    component.onReset()

    incidentService.filters$.subscribe((filters) => {
      expect(filters.severity).toBe('ALL')
      expect(filters.status).toBe('ALL')
      expect(filters.search).toBe('')
      done()
    })
  })
})
