import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { searchGymsService } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: searchGymsService

describe('Search gyms by query service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new searchGymsService(gymsRepository)
  })

  it('should be able to search gyms around', async () => {
    await gymsRepository.create({
      title: 'acad da boa',
      description: null,
      phone: null,
      latitude: -16.6782504,
      longitude: -49.2334693,
    })

    await gymsRepository.create({
      title: 'acad braba',
      description: null,
      phone: null,
      latitude: -16.6782504,
      longitude: -49.2334693,
    })

    const { gyms } = await sut.execute({
      page: 1,
      query: 'da boa',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'acad da boa' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      gymsRepository.create({
        title: `acad da boa ${i}`,
        description: null,
        phone: null,
        latitude: -16.6782504,
        longitude: -49.2334693,
      })
    }

    const { gyms } = await sut.execute({
      query: 'da boa',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'acad da boa 21' }),
      expect.objectContaining({ title: 'acad da boa 22' }),
    ])
  })
})
