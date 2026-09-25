import { Observable } from 'rxjs'
import { Service } from '@ops-board/shared-ui'

export abstract class ServiceRepository {
  abstract getServices(): Observable<Service[]>
  abstract getServiceById(id: string): Observable<Service | undefined>
}
