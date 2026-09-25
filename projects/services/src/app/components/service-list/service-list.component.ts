import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  Service,
  ServiceHealth,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  DrawerComponent,
  InputComponent,
  StatusIndicatorComponent,
  EmptyStateComponent
} from '@ops-board/shared-ui'
import { ServiceService } from '../../data/service.service'
import { ServiceDetailComponent } from '../service-detail/service-detail.component'

@Component({
  selector: 'services-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    DrawerComponent,
    InputComponent,
    StatusIndicatorComponent,
    EmptyStateComponent,
    ServiceDetailComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {
  private readonly serviceService = inject(ServiceService)

  readonly filteredServices$ = this.serviceService.filteredServices$
  readonly healthSummary$ = this.serviceService.healthSummary$
  readonly healthFilter$ = this.serviceService.healthFilter$
  readonly searchTerm$ = this.serviceService.searchTerm$
  readonly selectedService$ = this.serviceService.selectedService$

  isDrawerOpen = false

  trackById(_index: number, service: Service): string {
    return service.id
  }

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

  onSearchChange(term: string): void {
    this.serviceService.setSearchTerm(term)
  }

  setFilter(filter: ServiceHealth | 'all'): void {
    this.serviceService.setHealthFilter(filter)
  }

  resetFilters(): void {
    this.serviceService.setHealthFilter('all')
    this.serviceService.setSearchTerm('')
  }

  onSelectService(service: Service): void {
    this.serviceService.selectService(service)
    this.isDrawerOpen = true
  }

  closeDrawer(): void {
    this.isDrawerOpen = false
  }
}
