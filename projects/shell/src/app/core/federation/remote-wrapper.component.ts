import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Type
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { loadRemoteModule } from '@angular-architects/native-federation'
import { SpinnerComponent, ErrorStateComponent } from '@ops-board/shared-ui'
import { RuntimeConfigService } from '../config/runtime-config.service'

@Component({
  selector: 'app-remote-wrapper',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ErrorStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './remote-wrapper.component.html',
  styleUrls: ['./remote-wrapper.component.scss']
})
export class RemoteWrapperComponent implements OnInit {
  @Input() remoteName = ''
  @Input() exposedModule = './Component'

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef

  isLoading = true
  hasError = false
  errorMessage = ''

  constructor(
    private route: ActivatedRoute,
    private configService: RuntimeConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Read route data if not provided via input
    const routeData = this.route.snapshot.data
    if (routeData['remoteName']) {
      this.remoteName = routeData['remoteName']
    }
    if (routeData['exposedModule']) {
      this.exposedModule = routeData['exposedModule']
    }

    this.loadRemote()
  }

  async loadRemote(): Promise<void> {
    this.isLoading = true
    this.hasError = false
    this.errorMessage = ''
    this.container.clear()
    this.cdr.markForCheck()

    try {
      const remoteUrl = this.getRemoteUrl()
      // Load remote module with native federation
      const module = await loadRemoteModule({
        remoteEntry: `${remoteUrl}/remoteEntry.json`,
        remoteName: this.remoteName,
        exposedModule: this.exposedModule
      })

      // Find the component to render (support default export, named AppComponent, or exported Component)
      const componentType: Type<unknown> =
        module.default ||
        module.AppComponent ||
        module.Component ||
        module[Object.keys(module)[0]]

      if (!componentType) {
        throw new Error(
          `Exposed module ${this.exposedModule} in ${this.remoteName} did not export an Angular component.`
        )
      }

      this.container.createComponent(componentType)
      this.isLoading = false
      this.cdr.markForCheck()
    } catch (err: unknown) {
      this.isLoading = false
      this.hasError = true
      const remoteUrl = this.getRemoteUrl()
      const errDetail = err instanceof Error ? err.message : String(err)
      this.errorMessage = `Failed to load remote module [${this.remoteName}:${this.exposedModule}] from ${remoteUrl}. Details: ${errDetail}`
      this.cdr.markForCheck()
    }
  }

  private getRemoteUrl(): string {
    if (this.remoteName === 'incidents') {
      return this.configService.getRemoteUrl('incidentsRemote')
    }
    if (this.remoteName === 'services') {
      return this.configService.getRemoteUrl('servicesRemote')
    }
    return ''
  }
}
