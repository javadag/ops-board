import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BadgeComponent } from './badge.component'

describe('BadgeComponent', () => {
  let component: BadgeComponent
  let fixture: ComponentFixture<BadgeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(BadgeComponent)
    component = fixture.componentInstance
  })

  it('should create the badge component', () => {
    expect(component).toBeTruthy()
  })

  it('should render correct variant class for P1 severity', () => {
    component.variant = 'p1'
    component.text = 'CRITICAL P1'
    fixture.detectChanges()

    const badgeEl = fixture.nativeElement.querySelector('.badge')
    expect(badgeEl.classList).toContain('badge-p1')
    expect(badgeEl.textContent).toContain('CRITICAL P1')
  })

  it('should render dot when showDot is true', () => {
    component.showDot = true
    fixture.detectChanges()

    const dotEl = fixture.nativeElement.querySelector('.badge-dot')
    expect(dotEl).toBeTruthy()
  })
})
