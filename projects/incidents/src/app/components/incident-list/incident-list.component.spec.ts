import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { IncidentListComponent } from './incident-list.component'
import { IncidentService } from '../../data/incident.service'
import { MOCK_INCIDENTS } from '../../data/mock-incident.repository'

describe('IncidentListComponent', () => {
  let component: IncidentListComponent
  let fixture: ComponentFixture<IncidentListComponent>
  let mockIncidentService: Partial<IncidentService>

  beforeEach(async () => {
    mockIncidentService = {
      filteredIncidents$: of(MOCK_INCIDENTS),
      filters$: of({
        search: '',
        status: 'ALL',
        severity: 'ALL',
        service: 'ALL',
        sortBy: 'startTime',
        sortOrder: 'desc'
      }),
      selectedIncident$: of(null),
      selectIncident: jest.fn(),
      setSorting: jest.fn(),
      resetFilters: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [IncidentListComponent],
      providers: [{ provide: IncidentService, useValue: mockIncidentService }]
    }).compileComponents()

    fixture = TestBed.createComponent(IncidentListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create incident list component', () => {
    expect(component).toBeTruthy()
  })

  it('should render table columns for incidents', () => {
    expect(component.columns.length).toBe(7)
  })

  it('should delegate incident click to service', () => {
    component.onIncidentClick(MOCK_INCIDENTS[0])
    expect(mockIncidentService.selectIncident).toHaveBeenCalledWith(
      MOCK_INCIDENTS[0]
    )
  })
})
