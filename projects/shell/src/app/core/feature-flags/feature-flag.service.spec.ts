import { TestBed } from '@angular/core/testing'
import { FeatureFlagService } from './feature-flag.service'
import { RuntimeConfigService } from '../config/runtime-config.service'

describe('FeatureFlagService', () => {
  let service: FeatureFlagService
  let mockConfigService: Partial<RuntimeConfigService>

  beforeEach(() => {
    mockConfigService = {
      getFeatureFlags: () => ({
        incidentReplay: true,
        serviceDependencies: false,
        analytics: false,
        autoRefresh: true
      })
    }

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagService,
        { provide: RuntimeConfigService, useValue: mockConfigService }
      ]
    })

    service = TestBed.inject(FeatureFlagService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should correctly report initial flag values', () => {
    expect(service.isEnabled('incidentReplay')).toBe(true)
    expect(service.isEnabled('serviceDependencies')).toBe(false)
  })

  it('should update flag at runtime and emit new value', (done) => {
    service.observe('serviceDependencies').subscribe((enabled) => {
      if (enabled) {
        expect(enabled).toBe(true)
        done()
      }
    })

    service.setFlag('serviceDependencies', true)
    expect(service.isEnabled('serviceDependencies')).toBe(true)
  })
})
