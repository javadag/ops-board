import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  Incident,
  TimelineComponent,
  BadgeComponent,
  ButtonComponent,
  BadgeVariant
} from '@ops-board/shared-ui'
import { IncidentReplayComponent } from '../incident-replay/incident-replay.component'

@Component({
  selector: 'incidents-detail',
  standalone: true,
  imports: [
    CommonModule,
    TimelineComponent,
    BadgeComponent,
    ButtonComponent,
    IncidentReplayComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.scss']
})
export class IncidentDetailComponent {
  @Input() incident: Incident | null = null
  @Output() close = new EventEmitter<void>()

  viewMode = signal<'timeline' | 'replay'>('timeline')

  toggleViewMode(): void {
    this.viewMode.update((mode) =>
      mode === 'timeline' ? 'replay' : 'timeline'
    )
  }

  getSeverityBadge(sev: string): BadgeVariant {
    switch (sev) {
      case 'P1':
        return 'p1'
      case 'P2':
        return 'p2'
      case 'P3':
        return 'p3'
      case 'P4':
        return 'p4'
      default:
        return 'neutral'
    }
  }

  getStatusBadge(status: string): BadgeVariant {
    switch (status) {
      case 'Investigating':
        return 'warning'
      case 'Identified':
        return 'danger'
      case 'Monitoring':
        return 'info'
      case 'Resolved':
        return 'success'
      default:
        return 'neutral'
    }
  }

  formatTime(isoString: string): string {
    try {
      return new Date(isoString).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }
}
