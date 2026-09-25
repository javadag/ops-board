import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IncidentReplayComponent } from './incident-replay.component'
import { TimelineEvent } from '@ops-board/shared-ui'

describe('IncidentReplayComponent', () => {
  let component: IncidentReplayComponent
  let fixture: ComponentFixture<IncidentReplayComponent>

  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      timestamp: '2026-09-25T10:00:00Z',
      status: 'Investigating',
      summary: 'Alert triggered',
      author: 'Monitoring'
    },
    {
      id: '2',
      timestamp: '2026-09-25T10:15:00Z',
      status: 'Identified',
      summary: 'Root cause found',
      author: 'Alex Mercer'
    },
    {
      id: '3',
      timestamp: '2026-09-25T10:30:00Z',
      status: 'Resolved',
      summary: 'Incident resolved',
      author: 'Elena Rostova'
    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReplayComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(IncidentReplayComponent)
    component = fixture.componentInstance
    component.events = mockEvents
    component.reset()
  })

  afterEach(() => {
    component.ngOnDestroy()
  })

  it('should create replay component', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with step 1 and visible event 1', () => {
    expect(component.currentStep).toBe(1)
    expect(component.totalSteps).toBe(3)
    expect(component.visibleEvents.length).toBe(1)
  })

  it('should advance step manually with stepForward', () => {
    component.stepForward()
    expect(component.currentStep).toBe(2)
    expect(component.visibleEvents.length).toBe(2)
  })

  it('should toggle play and pause correctly', () => {
    expect(component.isPlaying).toBe(false)

    component.togglePlay()
    expect(component.isPlaying).toBe(true)

    component.togglePlay()
    expect(component.isPlaying).toBe(false)
  })

  it('should restart from step 0 and start playing', () => {
    component.stepForward()
    component.stepForward()
    expect(component.currentStep).toBe(3)

    component.restart()
    expect(component.isPlaying).toBe(true)
  })

  it('should change playback speed', () => {
    component.setSpeed(2)
    expect(component.playbackSpeed).toBe(2)
  })
})
