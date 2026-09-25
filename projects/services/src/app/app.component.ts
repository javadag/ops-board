import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ServiceListComponent } from './components/service-list/service-list.component'
import { ServiceRepository } from './data/service.repository'
import { MockServiceRepository } from './data/mock-service.repository'
import { ServiceService } from './data/service.service'

@Component({
  selector: 'services-root',
  standalone: true,
  imports: [CommonModule, ServiceListComponent],
  providers: [
    { provide: ServiceRepository, useClass: MockServiceRepository },
    ServiceService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
