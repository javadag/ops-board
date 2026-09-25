import { Injectable, signal } from '@angular/core'
import { User } from '@ops-board/shared-ui'

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@opsboard.internal',
    role: 'SRE Lead',
    team: 'Platform Reliability'
  },
  {
    id: 'user-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@opsboard.internal',
    role: 'On-Call Engineer',
    team: 'Core Payments'
  },
  {
    id: 'user-3',
    name: 'David Chen',
    email: 'david.chen@opsboard.internal',
    role: 'DevOps Engineer',
    team: 'Infrastructure Delivery'
  }
]

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private userSignal = signal<User | null>(MOCK_USERS[0])

  get currentUser(): User | null {
    return this.userSignal()
  }

  get user(): typeof this.userSignal {
    return this.userSignal
  }

  isLoggedIn(): boolean {
    return this.userSignal() !== null
  }

  login(userId: string): boolean {
    const found = MOCK_USERS.find((u) => u.id === userId)
    if (found) {
      this.userSignal.set(found)
      return true
    }
    return false
  }

  logout(): void {
    this.userSignal.set(null)
  }

  getAvailableUsers(): User[] {
    return MOCK_USERS
  }
}
