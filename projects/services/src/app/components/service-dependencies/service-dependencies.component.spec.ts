import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ServiceDependenciesComponent } from './service-dependencies.component'
import { ServiceDependency } from '@ops-board/shared-ui'

describe('ServiceDependenciesComponent', () => {
  let component: ServiceDependenciesComponent
  let fixture: ComponentFixture<ServiceDependenciesComponent>

  const mockDeps: ServiceDependency[] = [
    {
      id: 'svc-auth',
      name: 'Auth Service',
      type: 'upstream',
      health: 'healthy',
      protocol: 'gRPC'
    },
    {
      id: 'db-pg',
      name: 'PostgreSQL DB',
      type: 'downstream',
      health: 'degraded',
      protocol: 'PostgreSQL'
    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDependenciesComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceDependenciesComponent)
    component = fixture.componentInstance
    component.dependencies = mockDeps
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should partition upstream and downstream dependencies', () => {
    expect(component.upstreamDeps.length).toBe(1)
    expect(component.upstreamDeps[0].name).toBe('Auth Service')

    expect(component.downstreamDeps.length).toBe(1)
    expect(component.downstreamDeps[0].name).toBe('PostgreSQL DB')
  })

  it('should render dependency cards', () => {
    const el = fixture.nativeElement as HTMLElement
    const cards = el.querySelectorAll('.dep-card')
    expect(cards.length).toBe(2)
    expect(el.textContent).toContain('Auth Service')
    expect(el.textContent).toContain('PostgreSQL DB')
  })
})
