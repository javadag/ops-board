import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { ServiceDetailComponent } from './service-detail.component'
import { ServiceService } from '../../data/service.service'
import { ServiceRepository } from '../../data/service.repository'
import { EventBus } from '@ops-board/shared-ui'
import { MOCK_SERVICES } from '../../data/mock-service.repository'

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent
  let fixture: ComponentFixture<ServiceDetailComponent>
  let serviceService: ServiceService
  let router: Router

  beforeEach(async () => {
    const mockRepo: Partial<ServiceRepository> = {
      getServices: () => of([...MOCK_SERVICES]),
      getServiceById: (id: string) => of(MOCK_SERVICES.find((s) => s.id === id))
    }

    const mockRouter = {
      navigate: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [ServiceDetailComponent],
      providers: [
        ServiceService,
        { provide: ServiceRepository, useValue: mockRepo },
        { provide: EventBus, useValue: new EventBus() },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceDetailComponent)
    component = fixture.componentInstance
    serviceService = TestBed.inject(ServiceService)
    router = TestBed.inject(Router)
    component.service = MOCK_SERVICES[0]
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render service title, description, and telemetry KPIs', () => {
    const el = fixture.nativeElement as HTMLElement
    expect(el.textContent).toContain(MOCK_SERVICES[0].name)
    expect(el.textContent).toContain(MOCK_SERVICES[0].description)
    expect(el.textContent).toContain(`${MOCK_SERVICES[0].uptime}%`)
  })

  it('should broadcast event and navigate to incidents on viewIncidents()', () => {
    const broadcastSpy = jest.spyOn(serviceService, 'broadcastServiceSelected')

    component.viewIncidents()

    expect(broadcastSpy).toHaveBeenCalledWith(MOCK_SERVICES[0])
    expect(router.navigate).toHaveBeenCalledWith(['/incidents'], {
      queryParams: { service: MOCK_SERVICES[0].name }
    })
  })

  it('should emit closed when close button is clicked', () => {
    let closed = false
    component.closed.subscribe(() => {
      closed = true
    })

    const closeBtn = fixture.nativeElement.querySelector(
      '.header-actions ui-button:last-child'
    )
    closeBtn.dispatchEvent(new CustomEvent('clicked'))

    expect(closed).toBe(true)
  })
})
