import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'

export type ButtonVariant =
  'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary'
  @Input() size: ButtonSize = 'md'
  @Input() disabled = false
  @Input() loading = false
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Output() clicked = new EventEmitter<MouseEvent>()

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event)
    }
  }
}
