import {
  Component,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  Incident,
  DataTableComponent,
  ColumnDef,
  BadgeComponent,
  BadgeVariant,
  ButtonComponent,
  DrawerComponent,
  EmptyStateComponent
} from '@ops-board/shared-ui'
import { IncidentService } from '../../data/incident.service'
import { IncidentFiltersComponent } from '../incident-filters/incident-filters.component'
import { IncidentDetailComponent } from '../incident-detail/incident-detail.component'

@Component({
  selector: 'incidents-list',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    BadgeComponent,
    ButtonComponent,
    DrawerComponent,
    EmptyStateComponent,
    IncidentFiltersComponent,
    IncidentDetailComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent {
  @ViewChild('customCell', { static: true }) customCell!: TemplateRef<unknown>

  columns: ColumnDef<Incident>[] = [
    { key: 'severity', header: 'Severity', sortable: true, width: '90px' },
    { key: 'id', header: 'ID', sortable: true, width: '110px' },
    { key: 'title', header: 'Incident Title', sortable: true },
    {
      key: 'affectedService',
      header: 'Affected Service',
      sortable: true,
      width: '180px'
    },
    { key: 'status', header: 'Status', sortable: true, width: '130px' },
    { key: 'startTime', header: 'Triggered', sortable: true, width: '140px' },
    { key: 'actions', header: '', sortable: false, width: '90px' }
  ]

  constructor(public incidentService: IncidentService) {}

  getSeverityVariant(sev: string): BadgeVariant {
    switch (sev) {
      case 'P1':
        return 'p1'
      case 'P2':
        return 'p2'
      case 'P3':
        return 'p3'
      case 'P4':
        return 'p4'
      default:
        return 'neutral'
    }
  }

  getStatusVariant(status: string): BadgeVariant {
    switch (status) {
      case 'Investigating':
        return 'warning'
      case 'Identified':
        return 'danger'
      case 'Monitoring':
        return 'info'
      case 'Resolved':
        return 'success'
      default:
        return 'neutral'
    }
  }

  onIncidentClick(incident: Incident): void {
    this.incidentService.selectIncident(incident)
  }

  onSortChange(event: { column: string; order: 'asc' | 'desc' }): void {
    if (['startTime', 'severity', 'status', 'title'].includes(event.column)) {
      this.incidentService.setSorting(
        event.column as 'startTime' | 'severity' | 'status' | 'title',
        event.order
      )
    }
  }

  formatTime(isoString: string): string {
    try {
      return new Date(isoString).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }
}
