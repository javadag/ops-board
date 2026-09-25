import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '@ops-board/shared-ui'
import { RuntimeConfigService } from '../config/runtime-config.service'

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private flagsSubject: BehaviorSubject<FeatureFlags>
  public flags$: Observable<FeatureFlags>

  constructor(private configService: RuntimeConfigService) {
    const initialFlags =
      this.configService.getFeatureFlags() || DEFAULT_FEATURE_FLAGS
    this.flagsSubject = new BehaviorSubject<FeatureFlags>(initialFlags)
    this.flags$ = this.flagsSubject.asObservable()
  }

  /**
   * Synchronous check for a feature flag
   */
  isEnabled(flag: keyof FeatureFlags | string): boolean {
    return !!this.flagsSubject.value[flag]
  }

  /**
   * Observable check for a feature flag
   */
  observe(flag: keyof FeatureFlags | string): Observable<boolean> {
    return this.flags$.pipe(map((flags) => !!flags[flag]))
  }

  /**
   * Toggle or update a feature flag at runtime
   */
  setFlag(flag: keyof FeatureFlags | string, value: boolean): void {
    const updated = {
      ...this.flagsSubject.value,
      [flag]: value
    }
    this.flagsSubject.next(updated)
  }

  /**
   * Get all active flags snapshot
   */
  getAllFlags(): FeatureFlags {
    return this.flagsSubject.value
  }
}
