import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { ServiceListComponent } from './service-list.component'
import { ServiceService } from '../../data/service.service'
import { ServiceRepository } from '../../data/service.repository'
import { EventBus } from '@ops-board/shared-ui'
import { MOCK_SERVICES } from '../../data/mock-service.repository'

describe('ServiceListComponent', () => {
  let component: ServiceListComponent
  let fixture: ComponentFixture<ServiceListComponent>
  let serviceService: ServiceService

  beforeEach(async () => {
    const mockRepo: Partial<ServiceRepository> = {
      getServices: () => of([...MOCK_SERVICES]),
      getServiceById: (id: string) => of(MOCK_SERVICES.find((s) => s.id === id))
    }

    await TestBed.configureTestingModule({
      imports: [ServiceListComponent],
      providers: [
        ServiceService,
        { provide: ServiceRepository, useValue: mockRepo },
        { provide: EventBus, useValue: new EventBus() }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceListComponent)
    component = fixture.componentInstance
    serviceService = TestBed.inject(ServiceService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render service cards', () => {
    const el = fixture.nativeElement as HTMLElement
    const cards = el.querySelectorAll('.service-card')
    expect(cards.length).toBe(MOCK_SERVICES.length)
  })

  it('should open drawer on selecting a service', () => {
    const target = MOCK_SERVICES[0]
    component.onSelectService(target)
    expect(component.isDrawerOpen).toBe(true)
  })

  it('should filter by health status', (done) => {
    component.setFilter('degraded')

    component.filteredServices$.subscribe((services) => {
      expect(services.every((s) => s.health === 'degraded')).toBe(true)
      done()
    })
  })

  it('should reset filters', (done) => {
    component.setFilter('down')
    component.resetFilters()

    component.filteredServices$.subscribe((services) => {
      expect(services.length).toBe(MOCK_SERVICES.length)
      done()
    })
  })
})
