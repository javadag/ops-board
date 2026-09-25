import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IncidentListComponent } from './components/incident-list/incident-list.component'
import { IncidentRepository } from './data/incident.repository'
import { MockIncidentRepository } from './data/mock-incident.repository'
import { IncidentService } from './data/incident.service'

@Component({
  selector: 'incidents-root',
  standalone: true,
  imports: [CommonModule, IncidentListComponent],
  providers: [
    { provide: IncidentRepository, useClass: MockIncidentRepository },
    IncidentService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
