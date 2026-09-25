import { EventBus } from './event-bus.service'

describe('EventBus', () => {
  let eventBus: EventBus

  beforeEach(() => {
    // Reset global bus for clean testing
    if (typeof window !== 'undefined') {
      delete window.__OPS_BOARD_EVENT_BUS__
    }
    eventBus = new EventBus()
  })

  it('should emit and receive events of matching type', (done) => {
    const payload = {
      serviceId: 'svc-payments',
      serviceName: 'Payment Gateway'
    }

    eventBus.on<typeof payload>('service:selected').subscribe((received) => {
      expect(received).toEqual(payload)
      done()
    })

    eventBus.emit('service:selected', payload)
  })

  it('should not receive events of different type', (done) => {
    let wrongEventReceived = false

    eventBus.on('incident:selected').subscribe(() => {
      wrongEventReceived = true
    })

    eventBus.emit('service:selected', { serviceId: 'svc-auth' })

    setTimeout(() => {
      expect(wrongEventReceived).toBe(false)
      done()
    }, 50)
  })

  it('should maintain singleton communication via window global', () => {
    const bus1 = new EventBus()
    const bus2 = new EventBus()

    let receivedValue = ''
    bus2.on<{ message: string }>('test:ping').subscribe((data) => {
      receivedValue = data.message
    })

    bus1.emit('test:ping', { message: 'pong' })
    expect(receivedValue).toBe('pong')
  })
})
