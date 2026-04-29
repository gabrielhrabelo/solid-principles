import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymService } from './create-gym'
import { describe, expect, it, beforeEach } from 'vitest'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create gym service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'acad braba',
      description: null,
      phone: null,
      latitude: -16.6782504,
      longitude: -49.2334693,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
