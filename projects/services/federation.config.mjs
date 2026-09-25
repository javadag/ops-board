import {
  withNativeFederation,
  shareAll
} from '@angular-architects/native-federation/config'

export default withNativeFederation({
  name: 'services',
  exposes: {
    './Component': './projects/services/src/app/app.component.ts'
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    })
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket']
})
