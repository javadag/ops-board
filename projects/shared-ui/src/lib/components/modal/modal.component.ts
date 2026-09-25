import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpen = false
  @Input() title?: string
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
  @Input() showClose = true
  @Input() closeOnBackdrop = true
  @Input() hasFooter = false

  @Output() close = new EventEmitter<void>()

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close.emit()
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close.emit()
    }
  }
}
