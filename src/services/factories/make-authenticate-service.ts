import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '../authenticate'

// aqui é um depósito das dependências do service de authenticate

export function makeAuthenticateService() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateService = new AuthenticateService(usersRepository)

  return authenticateService
}
