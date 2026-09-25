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
  selector: 'ui-drawer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {
  @Input() isOpen = false
  @Input() title?: string
  @Input() subtitle?: string
  @Input() position: 'right' | 'left' = 'right'
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
