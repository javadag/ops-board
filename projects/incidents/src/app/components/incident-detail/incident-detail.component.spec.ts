import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IncidentDetailComponent } from './incident-detail.component'
import { MOCK_INCIDENTS } from '../../data/mock-incident.repository'

describe('IncidentDetailComponent', () => {
  let component: IncidentDetailComponent
  let fixture: ComponentFixture<IncidentDetailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(IncidentDetailComponent)
    component = fixture.componentInstance
    component.incident = MOCK_INCIDENTS[0]
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render incident title, id, and service', () => {
    const el = fixture.nativeElement as HTMLElement
    expect(el.textContent).toContain(MOCK_INCIDENTS[0].id)
    expect(el.textContent).toContain(MOCK_INCIDENTS[0].title)
    expect(el.textContent).toContain(MOCK_INCIDENTS[0].affectedService)
  })

  it('should toggle between timeline and replay view modes', () => {
    expect(component.viewMode()).toBe('timeline')
    component.toggleViewMode()
    expect(component.viewMode()).toBe('replay')
    component.toggleViewMode()
    expect(component.viewMode()).toBe('timeline')
  })

  it('should emit close when close button is clicked', () => {
    let closed = false
    component.close.subscribe(() => {
      closed = true
    })

    const closeBtn = fixture.nativeElement.querySelector(
      '.header-actions ui-button:last-child'
    )
    closeBtn.dispatchEvent(new CustomEvent('clicked'))

    expect(closed).toBe(true)
  })
})
