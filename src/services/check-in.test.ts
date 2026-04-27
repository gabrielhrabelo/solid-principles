import { expect, describe, it, vi, afterEach } from "vitest"
import { beforeEach } from "vitest"
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository"
import { CheckInService } from "./check-in"

let checkInsRepository: InMemoryCheckinsRepository
let sut: CheckInService

describe('Get User Profile Service', () => {

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository()
    sut = new CheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('it should be able to check in', async () => {
    const { checkIn } =  await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('it should be able to check in twice but not in the same day', async () => {
    vi.setSystemTime(new Date(2025, 3, 27, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2025, 3, 28, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01'
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})