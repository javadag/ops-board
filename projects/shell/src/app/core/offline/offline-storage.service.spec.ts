import { TestBed } from '@angular/core/testing'
import { OfflineStorageService } from './offline-storage.service'
import { Incident } from '@ops-board/shared-ui'

describe('OfflineStorageService', () => {
  let service: OfflineStorageService

  const mockIncident: Incident = {
    id: 'INC-TEST-1',
    title: 'Offline Test Incident',
    severity: 'P2',
    status: 'Investigating',
    affectedService: 'Auth Service',
    assignedTeam: 'Identity & Access',
    startTime: '2026-09-25T12:00:00Z',
    summary: 'Test summary',
    impact: 'Low impact',
    leadResponder: 'Alice',
    timeline: []
  }

  beforeEach(() => {
    localStorage.clear()
    TestBed.configureTestingModule({
      providers: [OfflineStorageService]
    })
    service = TestBed.inject(OfflineStorageService)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should save and load recent incidents to localStorage', (done) => {
    service.saveRecentIncident(mockIncident)

    service.recentIncidents$.subscribe((incidents) => {
      expect(incidents.length).toBe(1)
      expect(incidents[0].id).toBe('INC-TEST-1')
      done()
    })
  })

  it('should retrieve recent incident by id', () => {
    service.saveRecentIncident(mockIncident)
    const found = service.getRecentIncidentById('INC-TEST-1')
    expect(found).toBeDefined()
    expect(found?.title).toBe('Offline Test Incident')
  })

  it('should clear recent incidents', (done) => {
    service.saveRecentIncident(mockIncident)
    service.clearRecentIncidents()

    service.recentIncidents$.subscribe((incidents) => {
      expect(incidents.length).toBe(0)
      done()
    })
  })
})
