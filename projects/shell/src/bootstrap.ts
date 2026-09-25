import { bootstrapApplication } from '@angular/platform-browser'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideServiceWorker } from '@angular/service-worker'
import { isDevMode, APP_INITIALIZER } from '@angular/core'
import { AppComponent } from './app/app.component'
import { routes } from './app/app.routes'
import { RuntimeConfigService } from './app/core/config/runtime-config.service'

export function initializeApp(configService: RuntimeConfigService) {
  return () => configService.loadConfig()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [RuntimeConfigService],
      multi: true
    },
    provideServiceWorker('service-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch((err) => console.error(err))
