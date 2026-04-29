import type { GymsRepository } from '@/repositories/prisma/gyms-repository'
import type { Checkin } from '../../generated/prisma/client'
import type { CheckInsRepository } from '@/repositories/prisma/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxNumberCheckinsError } from './errors/max-number-of-checkins-error'
import { MaxDistanceError } from './errors/max-distance-error'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceResponse {
  checkIn: Checkin
}

export class CheckInService {
  constructor(
    private checkinsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculate distance between user and gym

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberCheckinsError()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return { checkIn }
  }
}
