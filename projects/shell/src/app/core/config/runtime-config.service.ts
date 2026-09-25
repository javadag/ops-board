import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '@ops-board/shared-ui'

export interface AppConfig {
  remotes: {
    incidentsRemote: string
    servicesRemote: string
    [key: string]: string
  }
  featureFlags: FeatureFlags
  environment: string
  version: string
}

const DEFAULT_CONFIG: AppConfig = {
  remotes: {
    incidentsRemote: 'http://localhost:4201',
    servicesRemote: 'http://localhost:4202'
  },
  featureFlags: DEFAULT_FEATURE_FLAGS,
  environment: 'development',
  version: '1.0.0'
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private config: AppConfig = DEFAULT_CONFIG
  private isLoaded = false

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<AppConfig> {
    if (this.isLoaded) {
      return this.config
    }

    try {
      // Add cache buster query param to guarantee fresh config
      const fetched = await firstValueFrom(
        this.http.get<Partial<AppConfig>>(
          `/assets/config.json?_t=${Date.now()}`
        )
      )

      this.config = {
        remotes: {
          ...DEFAULT_CONFIG.remotes,
          ...(fetched?.remotes || {})
        },
        featureFlags: {
          ...DEFAULT_CONFIG.featureFlags,
          ...(fetched?.featureFlags || {})
        },
        environment: fetched?.environment || DEFAULT_CONFIG.environment,
        version: fetched?.version || DEFAULT_CONFIG.version
      }
      this.isLoaded = true
    } catch {
      // Fallback gracefully to default config if config.json fails to load
      this.config = DEFAULT_CONFIG
      this.isLoaded = true
    }

    return this.config
  }

  getConfig(): AppConfig {
    return this.config
  }

  getRemoteUrl(key: 'incidentsRemote' | 'servicesRemote' | string): string {
    return this.config.remotes[key] || ''
  }

  getFeatureFlags(): FeatureFlags {
    return this.config.featureFlags
  }
}
