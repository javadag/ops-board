import { Observable } from 'rxjs'
import { Incident } from '@ops-board/shared-ui'

export abstract class IncidentRepository {
  abstract getIncidents(): Observable<Incident[]>
  abstract getIncidentById(id: string): Observable<Incident | undefined>
}
