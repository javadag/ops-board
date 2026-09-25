import { Routes } from '@angular/router'
import { ShellLayoutComponent } from './layout/shell-layout.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { LoginComponent } from './pages/login/login.component'
import { RemoteWrapperComponent } from './core/federation/remote-wrapper.component'
import { authGuard } from './core/auth/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'incidents',
        component: RemoteWrapperComponent,
        data: {
          remoteName: 'incidents',
          exposedModule: './Component'
        }
      },
      {
        path: 'services',
        component: RemoteWrapperComponent,
        data: {
          remoteName: 'services',
          exposedModule: './Component'
        }
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]
