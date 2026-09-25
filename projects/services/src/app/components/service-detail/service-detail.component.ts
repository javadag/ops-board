import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import {
  Service,
  BadgeComponent,
  ButtonComponent,
  StatusIndicatorComponent
} from '@ops-board/shared-ui'
import { ServiceDependenciesComponent } from '../service-dependencies/service-dependencies.component'
import { ServiceService } from '../../data/service.service'

@Component({
  selector: 'services-detail',
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    StatusIndicatorComponent,
    ServiceDependenciesComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent {
  @Input() service: Service | null = null
  @Input() showDependencies = true
  @Output() closed = new EventEmitter<void>()

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {}

  getHealthVariant(
    health: string
  ): 'success' | 'warning' | 'danger' | 'neutral' {
    switch (health) {
      case 'healthy':
        return 'success'
      case 'degraded':
        return 'warning'
      case 'down':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  viewIncidents(): void {
    if (!this.service) return
    this.serviceService.broadcastServiceSelected(this.service)
    this.router.navigate(['/incidents'], {
      queryParams: { service: this.service.name }
    })
  }
}
