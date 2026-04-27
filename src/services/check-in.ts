import type { Checkin} from "../../generated/prisma/client"
import type { CheckInsRepository } from "@/repositories/prisma/check-ins-repository"

interface CheckInServiceRequest {
  userId: string
  gymId: string
}

interface CheckInServiceResponse {
  checkIn: Checkin
}

export class CheckInService {
  constructor(
    private checkinsRepository: CheckInsRepository,
  ) {}

  async execute({ userId, gymId }: CheckInServiceRequest): Promise <CheckInServiceResponse> {
    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId
    })
    return { checkIn }
  }
}