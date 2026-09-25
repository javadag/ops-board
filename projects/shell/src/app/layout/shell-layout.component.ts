import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HeaderComponent } from './header.component'
import { SidebarComponent } from './sidebar.component'
import { OfflineStorageService } from '../core/offline/offline-storage.service'

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent {
  private readonly offlineService = inject(OfflineStorageService)
  readonly isOnline$ = this.offlineService.isOnline$

  sidebarOpen = signal(false)

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v)
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false)
  }

  onMainClick(): void {
    if (this.sidebarOpen()) {
      this.sidebarOpen.set(false)
    }
  }
}
