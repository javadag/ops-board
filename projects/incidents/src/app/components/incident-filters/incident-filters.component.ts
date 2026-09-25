import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  InputComponent,
  SelectComponent,
  ButtonComponent,
  IncidentSeverity,
  IncidentStatus
} from '@ops-board/shared-ui'
import { IncidentService } from '../../data/incident.service'

@Component({
  selector: 'incidents-filters',
  standalone: true,
  imports: [CommonModule, InputComponent, SelectComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-filters.component.html',
  styleUrls: ['./incident-filters.component.scss']
})
export class IncidentFiltersComponent {
  statusOptions: (IncidentStatus | 'ALL')[] = [
    'ALL',
    'Investigating',
    'Identified',
    'Monitoring',
    'Resolved'
  ]

  severityOptions: (IncidentSeverity | 'ALL')[] = [
    'ALL',
    'P1',
    'P2',
    'P3',
    'P4'
  ]

  serviceOptions = [
    { value: 'ALL', label: 'All Services' },
    { value: 'Payment Gateway', label: 'Payment Gateway' },
    { value: 'Auth Service', label: 'Auth Service' },
    { value: 'Order Processing', label: 'Order Processing' },
    { value: 'Notification Service', label: 'Notification Service' },
    { value: 'Search Service', label: 'Search Service' },
    { value: 'Static Web Assets', label: 'Static Web Assets' }
  ]

  constructor(public incidentService: IncidentService) {}

  onSearchChange(term: string): void {
    this.incidentService.setSearch(term)
  }

  onServiceChange(service: string): void {
    this.incidentService.setService(service)
  }

  onStatusClick(status: IncidentStatus | 'ALL'): void {
    this.incidentService.setStatus(status)
  }

  onSeverityClick(severity: IncidentSeverity | 'ALL'): void {
    this.incidentService.setSeverity(severity)
  }

  onReset(): void {
    this.incidentService.resetFilters()
  }
}
