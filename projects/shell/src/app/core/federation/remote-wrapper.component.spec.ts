import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { RemoteWrapperComponent } from './remote-wrapper.component'
import { RuntimeConfigService } from '../config/runtime-config.service'

jest.mock('@angular-architects/native-federation', () => ({
  loadRemoteModule: jest.fn().mockRejectedValue(new Error('Connection refused'))
}))

describe('RemoteWrapperComponent', () => {
  let component: RemoteWrapperComponent
  let fixture: ComponentFixture<RemoteWrapperComponent>
  let mockConfigService: Partial<RuntimeConfigService>

  beforeEach(async () => {
    mockConfigService = {
      getRemoteUrl: (key: string) =>
        key === 'incidentsRemote'
          ? 'http://localhost:4201'
          : 'http://localhost:4202'
    }

    await TestBed.configureTestingModule({
      imports: [RemoteWrapperComponent],
      providers: [
        { provide: RuntimeConfigService, useValue: mockConfigService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                remoteName: 'incidents',
                exposedModule: './Component'
              }
            }
          }
        }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(RemoteWrapperComponent)
    component = fixture.componentInstance
  })

  it('should initialize and show error gracefully when remote server is offline', async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(component.hasError).toBe(true)
    expect(component.isLoading).toBe(false)

    const errorEl = fixture.nativeElement.querySelector('ui-error-state')
    expect(errorEl).toBeTruthy()
  })
})
