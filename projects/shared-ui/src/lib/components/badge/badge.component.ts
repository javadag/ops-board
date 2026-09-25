import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'

export type BadgeVariant =
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'healthy'
  | 'degraded'
  | 'down'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'

export type BadgeSize = 'sm' | 'md'

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral'
  @Input() size: BadgeSize = 'sm'
  @Input() text = ''
  @Input() label?: string
  @Input() showDot = false
}
