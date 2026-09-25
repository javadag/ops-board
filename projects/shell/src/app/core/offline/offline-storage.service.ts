import { Injectable, OnDestroy } from '@angular/core'
import {
  BehaviorSubject,
  Observable,
  fromEvent,
  merge,
  Subscription
} from 'rxjs'
import { map } from 'rxjs/operators'
import { Incident } from '@ops-board/shared-ui'

const RECENT_INCIDENTS_KEY = 'opsboard_recent_incidents'
const MAX_RECENT_INCIDENTS = 10

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService implements OnDestroy {
  private readonly isOnlineSubject = new BehaviorSubject<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  readonly isOnline$: Observable<boolean> = this.isOnlineSubject.asObservable()

  private readonly recentIncidentsSubject = new BehaviorSubject<Incident[]>([])
  readonly recentIncidents$: Observable<Incident[]> =
    this.recentIncidentsSubject.asObservable()

  private subscription: Subscription | null = null

  constructor() {
    this.initNetworkListener()
    this.loadRecentIncidents()
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  private initNetworkListener(): void {
    if (typeof window === 'undefined') return

    this.subscription = merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe((status) => {
      this.isOnlineSubject.next(status)
    })
  }

  loadRecentIncidents(): void {
    if (typeof localStorage === 'undefined') return

    try {
      const raw = localStorage.getItem(RECENT_INCIDENTS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Incident[]
        this.recentIncidentsSubject.next(parsed)
      }
    } catch {
      this.recentIncidentsSubject.next([])
    }
  }

  saveRecentIncident(incident: Incident): void {
    if (typeof localStorage === 'undefined') return

    try {
      const current = this.recentIncidentsSubject.getValue()
      const filtered = current.filter((i) => i.id !== incident.id)
      const updated = [incident, ...filtered].slice(0, MAX_RECENT_INCIDENTS)

      localStorage.setItem(RECENT_INCIDENTS_KEY, JSON.stringify(updated))
      this.recentIncidentsSubject.next(updated)
    } catch {
      // Ignore quota errors in private browsing
    }
  }

  getRecentIncidentById(id: string): Incident | undefined {
    return this.recentIncidentsSubject.getValue().find((i) => i.id === id)
  }

  clearRecentIncidents(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(RECENT_INCIDENTS_KEY)
    }
    this.recentIncidentsSubject.next([])
  }
}
