import { initFederation } from '@angular-architects/native-federation'

initFederation()
  .catch((err) =>
    console.error('Failed to initialize Native Federation in Shell:', err)
  )
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('Failed to bootstrap Shell application:', err))
