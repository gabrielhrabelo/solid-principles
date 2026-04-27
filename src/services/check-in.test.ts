import { expect, describe, it } from "vitest"
import { beforeEach } from "vitest"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-checkins-repository"
import { CheckInService } from "./check-in"

let checkInsRepository: InMemoryCheckinsRepository
let sut: CheckInService

describe('Get User Profile Service', () => {

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository()
    sut = new CheckInService(checkInsRepository)
  })

  it('it should be able to check in', async () => {
    const { checkIn } =  await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
})