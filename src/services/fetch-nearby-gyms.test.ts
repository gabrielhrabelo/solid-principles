import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch nearby gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'near gym',
      description: null,
      phone: null,
      latitude: -16.7730735,
      longitude: -49.2606503,
    })
    await gymsRepository.create({
      title: 'far gym',
      description: null,
      phone: null,
      latitude: -16.6008935,
      longitude: -49.2587835,
      // -16.6008935,-49.2587835
    })

    const { gyms } = await sut.execute({
      userLatitude: -16.7730735,
      userLongitude: -49.2606503,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })])
  })
})
