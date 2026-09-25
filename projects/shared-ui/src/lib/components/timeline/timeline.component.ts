import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TimelineEvent } from '../../models/incident.model'
import { BadgeComponent, BadgeVariant } from '../badge/badge.component'

@Component({
  selector: 'ui-timeline',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = []

  getStatusVariant(status: string): BadgeVariant {
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
      const date = new Date(isoString)
      return (
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) +
        ' (' +
        date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        ')'
      )
    } catch {
      return isoString
    }
  }
}
