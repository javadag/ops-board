import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideServiceWorker } from '@angular/service-worker'
import { inject, isDevMode, provideAppInitializer } from '@angular/core'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'
import { RuntimeConfigService } from './app/core/config/runtime-config.service'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAppInitializer(() => {
      const configService = inject(RuntimeConfigService)
      return configService.loadConfig()
    }),
    provideServiceWorker('service-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch((err) => console.error(err))
