import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'

export type IndicatorStatus = 'healthy' | 'degraded' | 'down' | 'neutral'

@Component({
  selector: 'ui-status-indicator',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss']
})
export class StatusIndicatorComponent {
  @Input() status: IndicatorStatus = 'neutral'
  @Input() label?: string
  @Input() pulse = true
}
