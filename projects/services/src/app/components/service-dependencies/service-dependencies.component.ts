import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ServiceDependency,
  BadgeComponent,
  StatusIndicatorComponent
} from '@ops-board/shared-ui'

@Component({
  selector: 'services-dependencies',
  standalone: true,
  imports: [CommonModule, BadgeComponent, StatusIndicatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-dependencies.component.html',
  styleUrls: ['./service-dependencies.component.scss']
})
export class ServiceDependenciesComponent {
  @Input() dependencies: ServiceDependency[] = []

  get upstreamDeps(): ServiceDependency[] {
    return this.dependencies.filter((d) => d.type === 'upstream')
  }

  get downstreamDeps(): ServiceDependency[] {
    return this.dependencies.filter((d) => d.type === 'downstream')
  }
}
