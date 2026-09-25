import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  TimelineEvent,
  TimelineComponent,
  ButtonComponent,
  BadgeComponent
} from '@ops-board/shared-ui'

@Component({
  selector: 'incidents-replay',
  standalone: true,
  imports: [CommonModule, TimelineComponent, ButtonComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-replay.component.html',
  styleUrls: ['./incident-replay.component.scss']
})
export class IncidentReplayComponent implements OnChanges, OnDestroy {
  @Input() events: TimelineEvent[] = []

  speedOptions = [1, 2, 5]
  playbackSpeed = 1

  currentStep = 0
  isPlaying = false

  private timerId: ReturnType<typeof setInterval> | null = null
  private readonly baseIntervalMs = 1200

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.reset()
    }
  }

  ngOnDestroy(): void {
    this.stopTimer()
  }

  get totalSteps(): number {
    return this.events?.length || 0
  }

  get isCompleted(): boolean {
    return this.totalSteps > 0 && this.currentStep >= this.totalSteps
  }

  get progressPercent(): number {
    if (this.totalSteps === 0) return 0
    return Math.round((this.currentStep / this.totalSteps) * 100)
  }

  get visibleEvents(): TimelineEvent[] {
    return this.events.slice(0, this.currentStep)
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  play(): void {
    if (this.isCompleted) {
      this.currentStep = 0
    }
    this.isPlaying = true
    this.startTimer()
  }

  pause(): void {
    this.isPlaying = false
    this.stopTimer()
  }

  restart(): void {
    this.pause()
    this.currentStep = 0
    this.cdr.markForCheck()
  }

  stepForward(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++
      this.cdr.markForCheck()
    }
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = speed
    if (this.isPlaying) {
      this.startTimer()
    }
  }

  private startTimer(): void {
    this.stopTimer()
    const interval = Math.max(
      150,
      Math.round(this.baseIntervalMs / this.playbackSpeed)
    )

    this.timerId = setInterval(() => {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
        this.cdr.markForCheck()
      } else {
        this.pause()
        this.cdr.markForCheck()
      }
    }, interval)
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  private reset(): void {
    this.pause()
    this.currentStep = 0
    this.cdr.markForCheck()
  }
}
