import type { GymsRepository } from '@/repositories/prisma/gyms-repository'
import type { Gym } from '../../generated/prisma/browser'

interface searchGymsServiceRequest {
  query: string
  page: number
}

interface searchGymsServiceResponse {
  gyms: Gym[]
}

export class searchGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: searchGymsServiceRequest): Promise<searchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
