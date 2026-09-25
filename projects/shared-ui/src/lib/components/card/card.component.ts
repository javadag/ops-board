import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string
  @Input() subtitle?: string
  @Input() hasHeader = false
  @Input() hasFooter = false
  @Input() interactive = false
  @Input() elevated = false
  @Input() noPadding = false
}
