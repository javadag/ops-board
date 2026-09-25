import { initFederation } from '@angular-architects/native-federation'

initFederation()
  .catch((err) =>
    console.error('Failed to init Native Federation in Services MFE:', err)
  )
  .then(() => import('./bootstrap'))
  .catch((err) => console.error('Failed to bootstrap Services MFE:', err))
