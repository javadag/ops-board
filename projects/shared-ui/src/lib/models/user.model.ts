export interface User {
  id: string
  name: string
  email: string
  role: 'SRE Lead' | 'On-Call Engineer' | 'DevOps Engineer' | 'Viewer'
  avatar?: string
  team: string
}
