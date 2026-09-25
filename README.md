# ⚡ OpsBoard — Incident Operations Platform

> A production-grade **Angular 22** Micro Frontend platform for Site Reliability Engineers (SRE) and DevOps teams, built with **Native Federation**, **SCSS Design Tokens**, **RxJS Event-Driven Communication**, **Jest**, and **PWA Offline Resilience**.

[![Angular 22](https://img.shields.io/badge/Angular-22.2-dd0031.svg?logo=angular)](https://angular.dev)
[![Native Federation](https://img.shields.io/badge/Native%20Federation-22.2-blue.svg)](https://github.com/angular-architects/module-federation-plugin)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest-c21325.svg?logo=jest)](https://jestjs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Project Overview

**OpsBoard** demonstrates modern enterprise frontend architecture by decomposing an operational incident management console into independently buildable, independently deployable Micro Frontends (MFEs) orchestrated by a lightweight Shell host.

### Key Highlights

- **Modern Micro Frontend Architecture**: Powered by browser-native ECMAScript Modules (ESM) and Import Maps via `@angular-architects/native-federation`. Zero legacy Webpack build baggage.
- **Runtime Configuration**: Remote MFE URLs and feature flags are loaded dynamically at runtime via `/assets/config.json`. No build-time environment locking.
- **Fault-Tolerant Error Boundaries**: If a remote MFE is unreachable or crashes, the Shell isolates the failure with a retry card while the rest of the application remains fully functional.
- **Loose Coupling via RxJS EventBus**: Shared event bus singleton with `window.__OPS_BOARD_EVENT_BUS__` fallback coordinates cross-MFE interactions (`service:selected`, `incident:selected`) without direct imports.
- **Interactive Incident Replay Engine**: Deterministic timeline playback controller (Play, Pause, Restart, Speed controls) to reconstruct incident progression step-by-step.
- **Repository Pattern**: Strict separation between UI components, domain services, and abstract repositories (`MockIncidentRepository`, `MockServiceRepository`) ready for live API replacement.
- **Pure SCSS Design System**: Technical high-contrast DevOps palette with structured CSS custom properties. Zero Tailwind CSS dependency.
- **PWA & Offline Fallback**: Service worker caching and localStorage fallback for recently viewed incidents during network drops.

---

## 🏗️ Architecture & Topology

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT BROWSER                                   |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             SHELL (Port 4200)                               |  |
|  |  • Layout, Header, Mobile Sidebar, KPI Command Center                       |  |
|  |  • Runtime Config Loader (/assets/config.json)                              |  |
|  |  • FeatureFlagService (Reactive Toggles) & MockAuthService                  |  |
|  |  • RemoteWrapperComponent (Dynamic ESM Loader & Fault Isolation)            |  |
|  |  • Offline Storage & Service Worker (PWA)                                   |  |
|  +--------------------------------------+--------------------------------------+  |
|                                         |                                         |
|                   Dynamic ESM           |           Dynamic ESM                   |
|                   Import Maps           |           Import Maps                   |
|                                         v                                         |
|              +--------------------------+--------------------------+              |
|              |                                                     |              |
|              v                                                     v              |
|  +-----------------------+                             +-----------------------+  |
|  |     INCIDENTS MFE     |                             |     SERVICES MFE      |  |
|  |      (Port 4201)      |                             |      (Port 4202)      |  |
|  |                       |                             |                       |  |
|  | • Multi-Filter Search |                             | • Service Catalog     |  |
|  | • Severity & Status   |                             | • Health Indicators   |  |
|  | • Chrono Timeline     |                             | • P99 & SLA Metrics   |  |
|  | • Incident Replay     |                             | • Deployment History  |  |
|  |   (Play/Pause/Reset)  |                             | • Dependency Graph    |  |
|  +-----------+-----------+                             +-----------+-----------+  |
|              |                                                     |              |
|              +--------------------------+--------------------------+              |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                    @ops-board/shared-ui (Shared Library)                    |  |
|  |  • UI Components: Button, Badge, Card, Modal, Drawer, DataTable, Timeline,  |  |
|  |    Spinner, EmptyState, ErrorState, StatusIndicator, Input, Select          |  |
|  |  • SCSS Design Tokens (Dark slate SRE palette, CSS custom properties)       |  |
|  |  • EventBus Singleton: Cross-MFE pub/sub with window global fallback        |  |
|  |  • Shared Domain Models (Incident, Service, FeatureFlags, User)            |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 📦 Application Breakdown & Port Matrix

| Application       | Port   | Type    | Responsibility                                                                                                            |
| ----------------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Shell**         | `4200` | Host    | Layout, routing, runtime config, feature flags, authentication, remote wrapper error boundaries, PWA offline resilience.  |
| **Incidents MFE** | `4201` | Remote  | Incident catalog, search, status/severity/service filters, incident details drawer, deterministic Incident Replay player. |
| **Services MFE**  | `4202` | Remote  | Service health monitoring, latency/error rate telemetry, deployment history, dependency topology, cross-MFE deep links.   |
| **Shared UI**     | N/A    | Library | Reusable UI components, SCSS design tokens, RxJS EventBus, TypeScript domain models.                                      |

---

## 🛠️ Technology Stack

- **Framework**: Angular 22.2.0 (Standalone Components, Signals, `OnPush` Change Detection)
- **MFE Engine**: `@angular-architects/native-federation` 22.2.1 (ESM + Import Maps)
- **Language**: TypeScript 6.0.3 (Strict Mode)
- **Styling**: SCSS (CSS Custom Properties, DevOps dark slate theme, responsive mixins)
- **State & Events**: RxJS 7.8.1 (Reactive streams, Subject-based EventBus)
- **Testing**: Jest 30.5.2 with `jest-preset-angular` 17.0.1
- **PWA**: Service Worker static caching + localStorage incident caching for offline resilience

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` LTS
- **npm**: `v10+`

### 2. Installation

```bash
git clone https://github.com/example/ops-board.git
cd ops-board
npm install
```

### 3. Start All Applications Concurrently

```bash
npm start
# or: npm run start:all
```

This spawns all three applications in parallel with labeled, color-coded console logs:

- `[SHELL:4200]` http://localhost:4200
- `[INCIDENTS:4201]` http://localhost:4201
- `[SERVICES:4202]` http://localhost:4202

Open **`http://localhost:4200`** in your browser to view the platform.

### 4. Start Individual Applications Standalone

Each remote and the shell can also be developed and tested in isolation:

```bash
# Run Shell host
npm run start:shell

# Run Incidents MFE independently
npm run start:incidents

# Run Services MFE independently
npm run start:services
```

---

## 🧪 Testing

OpsBoard includes comprehensive unit and integration test suites executed with **Jest**:

```bash
# Run all unit tests across all projects
npm test

# Run tests with watch mode
npm run test:watch

# Run tests and generate code coverage report
npm run test:coverage
```

### Tested Domains:

- `IncidentService`: Search debounce, multi-parameter filtering, sort pipelines, and `service:selected` cross-MFE events.
- `IncidentReplay`: Play, pause, restart, and speed multiplier state machines.
- `ServiceService`: Health summary calculations and service selection broadcasting.
- `FeatureFlagService`: Dynamic flag evaluation and observable streaming.
- `EventBus`: Cross-MFE pub/sub emission, typed events, and window fallback.
- `RemoteWrapperComponent`: Dynamic federation module loading, error interception, and retry action.
- `OfflineStorageService`: Network status listeners and localStorage incident persistence.
- `UI Components`: Button, Badge, StatusIndicator, DataTable, Drawer, Modal, and more.

---

## ⚙️ Runtime Configuration & Feature Flags

Configuration is externalized in `projects/shell/src/assets/config.json`:

```json
{
  "incidentsRemote": "http://localhost:4201",
  "servicesRemote": "http://localhost:4202",
  "featureFlags": {
    "incidentReplay": true,
    "serviceDependencies": true,
    "analytics": false
  }
}
```

The Shell fetches this JSON via `APP_INITIALIZER` prior to bootstrap. Feature flags can be inspected and toggled live in the navigation sidebar.

---

## 🔄 Cross-MFE Communication

Communication between micro frontends is managed via an RxJS `EventBus` singleton exported from `@ops-board/shared-ui`:

```typescript
// Services MFE: Broadcasting user action
this.eventBus.emit('service:selected', {
  serviceId: service.id,
  serviceName: service.name
})

// Incidents MFE: Reacting to external selection
this.eventBus
  .on<{ serviceName: string }>('service:selected')
  .pipe(takeUntil(this.destroy$))
  .subscribe(({ serviceName }) => {
    this.setService(serviceName)
  })
```

To guarantee singleton behavior even across isolated federation scopes, the bus checks and binds to `window.__OPS_BOARD_EVENT_BUS__`.

---

## 🛡️ Error Handling & Fault Isolation

If an MFE remote server becomes unavailable (e.g. port 4201 is terminated), the Shell:

1. Catches the dynamic import error in `RemoteWrapperComponent`.
2. Displays an accessible `ui-error-state` card with technical details and a **"Retry Connection"** button.
3. Keeps the Shell navigation, user session, and Services MFE running without disruption.

---

## 📁 Documentation

Detailed documentation is available in the `docs/` directory:

- [Architecture Deep-Dive](docs/architecture.md) — Comprehensive technical design, ESM import maps, and data flow.
- [Architecture Decision Records (ADRs)](docs/decisions.md) — Detailed rationale for Native Federation, Standalone Signals, Repository Pattern, and SCSS Tokens.
- [Developer Guide](docs/development.md) — Step-by-step guide for creating new components, adding remotes, and building for production.

---

## 📄 License

MIT © OpsBoard Contributors
