import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BadgeComponent } from '@ops-board/shared-ui'
import { FeatureFlagService } from '../core/feature-flags/feature-flag.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = false
  @Output() closeMobile = new EventEmitter<void>()

  constructor(public featureFlags: FeatureFlagService) {}

  toggleFlag(flag: string, event: Event): void {
    const input = event.target as HTMLInputElement
    this.featureFlags.setFlag(flag, input.checked)
  }
}
