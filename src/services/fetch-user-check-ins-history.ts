import type { CheckInsRepository } from "@/repositories/prisma/check-ins-repository"
import type { Checkin } from "../../generated/prisma/client"

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkIns: Checkin[]
}

export class FetchUserCheckInsService {
  constructor (private checkInsRepository: CheckInsRepository){}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}