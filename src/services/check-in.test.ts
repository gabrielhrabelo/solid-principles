import { expect, describe, it, vi, afterEach } from 'vitest'
import { beforeEach } from 'vitest'
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/client'

let checkInsRepository: InMemoryCheckinsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'acad braba',
      description: '',
      phone: '',
      latitude: -16.6782504,
      longitude: -49.2334693,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('it should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6782504,
      userLongitude: -49.2334693,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('it should be able to check in twice but not in the same day', async () => {
    vi.setSystemTime(new Date(2025, 3, 27, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6782504,
      userLongitude: -49.2334693,
    })

    vi.setSystemTime(new Date(2025, 3, 28, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6782504,
      userLongitude: -49.2334693,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('it should not to be able to check in on distant gym', async () => {
    // -16.6782504,-49.2334693

    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      title: 'acad braba',
      phone: '',
      latitude: new Decimal(-16.6782504),
      longitude: new Decimal(-49.2334693),
    })

    // -16.7730735,-49.2606503

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.7730735,
        userLongitude: -49.2606503,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
