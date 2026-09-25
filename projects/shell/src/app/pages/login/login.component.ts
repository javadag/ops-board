import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import {
  ButtonComponent,
  CardComponent,
  BadgeComponent
} from '@ops-board/shared-ui'
import { MockAuthService, MOCK_USERS } from '../../core/auth/mock-auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  users = MOCK_USERS
  selectedUserId = MOCK_USERS[0].id

  constructor(
    private authService: MockAuthService,
    private router: Router
  ) {}

  selectUser(id: string): void {
    this.selectedUserId = id
  }

  onLogin(): void {
    this.authService.login(this.selectedUserId)
    this.router.navigate(['/'])
  }
}
