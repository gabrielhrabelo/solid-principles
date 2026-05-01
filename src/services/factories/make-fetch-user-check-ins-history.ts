import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsService } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInsService(checkInsRepository)

  return service
}

