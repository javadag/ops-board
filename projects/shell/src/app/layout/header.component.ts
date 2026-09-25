import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { BadgeComponent, StatusIndicatorComponent } from '@ops-board/shared-ui'
import { MockAuthService } from '../core/auth/mock-auth.service'
import { RuntimeConfigService } from '../core/config/runtime-config.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BadgeComponent,
    StatusIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>()

  constructor(
    public authService: MockAuthService,
    public configService: RuntimeConfigService
  ) {}
}
