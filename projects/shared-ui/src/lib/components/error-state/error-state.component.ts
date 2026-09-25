import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ui-error-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent {
  @Input() title = 'An error occurred'
  @Input() message = 'Failed to load content. Please try again.'
  @Input() showRetry = true
  @Input() retryLabel = 'Retry'
  @Output() retry = new EventEmitter<void>()

  onRetry(): void {
    this.retry.emit()
  }
}
