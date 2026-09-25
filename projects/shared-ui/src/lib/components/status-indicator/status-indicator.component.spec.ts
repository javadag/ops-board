import { ComponentFixture, TestBed } from '@angular/core/testing'
import { StatusIndicatorComponent } from './status-indicator.component'

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent
  let fixture: ComponentFixture<StatusIndicatorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndicatorComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(StatusIndicatorComponent)
    component = fixture.componentInstance
  })

  it('should create status indicator', () => {
    expect(component).toBeTruthy()
  })

  it('should apply status-healthy class and display label', () => {
    component.status = 'healthy'
    component.label = 'Operational'
    fixture.detectChanges()

    const indicator = fixture.nativeElement.querySelector('.indicator')
    expect(indicator.classList).toContain('status-healthy')

    const label = fixture.nativeElement.querySelector('.label')
    expect(label.textContent).toBe('Operational')
  })

  it('should display pulse ring when pulse is true and status is healthy', () => {
    component.status = 'healthy'
    component.pulse = true
    fixture.detectChanges()

    const pulseRing = fixture.nativeElement.querySelector('.pulse-ring')
    expect(pulseRing).toBeTruthy()
  })

  it('should not display pulse ring when status is neutral', () => {
    component.status = 'neutral'
    component.pulse = true
    fixture.detectChanges()

    const pulseRing = fixture.nativeElement.querySelector('.pulse-ring')
    expect(pulseRing).toBeFalsy()
  })
})
