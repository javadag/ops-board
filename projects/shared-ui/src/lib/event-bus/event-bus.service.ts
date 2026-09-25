import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

export interface AppEvent<T = unknown> {
  type: string
  payload: T
  timestamp: number
}

export interface ServiceSelectedPayload {
  serviceId: string
  serviceName: string
}

export interface IncidentSelectedPayload {
  incidentId: string
  severity?: string
  service?: string
}

declare global {
  interface Window {
    __OPS_BOARD_EVENT_BUS__?: Subject<AppEvent<unknown>>
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventBus {
  private readonly bus$: Subject<AppEvent<unknown>>

  constructor() {
    // Cross-bundle singleton guarantee via window object
    if (typeof window !== 'undefined') {
      if (!window.__OPS_BOARD_EVENT_BUS__) {
        window.__OPS_BOARD_EVENT_BUS__ = new Subject<AppEvent<unknown>>()
      }
      this.bus$ = window.__OPS_BOARD_EVENT_BUS__
    } else {
      this.bus$ = new Subject<AppEvent<unknown>>()
    }
  }

  /**
   * Emit an event across micro frontends
   */
  emit<T>(type: string, payload: T): void {
    this.bus$.next({
      type,
      payload,
      timestamp: Date.now()
    })
  }

  /**
   * Listen for events of a specific type
   */
  on<T>(type: string): Observable<T> {
    return this.bus$.asObservable().pipe(
      filter((event): event is AppEvent<T> => event.type === type),
      map((event) => event.payload)
    )
  }

  /**
   * Listen for all events (useful for logging / telemetry / analytics)
   */
  all$(): Observable<AppEvent<unknown>> {
    return this.bus$.asObservable()
  }
}
