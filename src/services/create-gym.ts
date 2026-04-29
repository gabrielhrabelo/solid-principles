import type { Gym } from '../../generated/prisma/browser'
import type { GymsRepository } from '@/repositories/prisma/gyms-repository'

interface CreateGymServiceRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
