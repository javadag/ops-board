import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import {
  CardComponent,
  BadgeComponent,
  ButtonComponent,
  StatusIndicatorComponent
} from '@ops-board/shared-ui'
import { RuntimeConfigService } from '../../core/config/runtime-config.service'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    StatusIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  get configJson(): string {
    return JSON.stringify(this.configService.getConfig(), null, 2)
  }

  constructor(private configService: RuntimeConfigService) {}
}
