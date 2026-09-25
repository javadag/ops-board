#!/usr/bin/env node

import { spawn, execSync } from 'node:child_process'
import process from 'node:process'

const apps = [
  { name: 'SHELL', port: 4200, project: 'shell', color: '\x1b[36m' }, // cyan
  { name: 'INCIDENTS', port: 4201, project: 'incidents', color: '\x1b[33m' }, // yellow
  { name: 'SERVICES', port: 4202, project: 'services', color: '\x1b[35m' } // magenta
]

const resetColor = '\x1b[0m'
const bold = '\x1b[1m'
const processes = []

console.log(
  `${bold}====================================================${resetColor}`
)
console.log(
  `${bold}   ⚡ OpsBoard Micro Frontend Operations Platform   ${resetColor}`
)
console.log(
  `${bold}====================================================${resetColor}`
)

console.log('Building shared-ui library first...')
try {
  execSync('npm run build:shared', { stdio: 'inherit' })
  console.log('shared-ui built successfully.\n')
} catch (error) {
  console.error('Failed to build shared-ui:', error)
  process.exit(1)
}

console.log('Starting all 3 applications in concurrent development mode:\n')
apps.forEach((a) => {
  console.log(
    `  • ${a.color}[${a.name}]${resetColor} http://localhost:${a.port}`
  )
})
console.log('\nPress Ctrl+C to stop all applications.\n')

function startApp(app) {
  const child = spawn(
    'npx',
    ['ng', 'serve', app.project, '--port', String(app.port)],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        NG_BUILD_OPTIMIZE_CHUNKS: '0'
      }
    }
  )

  const prefix = `${app.color}[${app.name}:${app.port}]${resetColor} `

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n')
    lines.forEach((line) => {
      if (line.trim()) {
        process.stdout.write(prefix + line + '\n')
      }
    })
  })

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n')
    lines.forEach((line) => {
      if (line.trim()) {
        process.stderr.write(prefix + line + '\n')
      }
    })
  })

  child.on('exit', (code, signal) => {
    console.log(`${prefix}Process exited with code ${code ?? signal}`)
  })

  processes.push(child)
}

apps.forEach(startApp)

function shutdown() {
  console.log(
    `\n${bold}Shutting down all OpsBoard applications...${resetColor}`
  )
  processes.forEach((proc) => {
    try {
      proc.kill('SIGINT')
    } catch {
      // ignore
    }
  })
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
