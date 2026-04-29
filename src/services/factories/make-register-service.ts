import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register'

// aqui é um depósito das dependencias do service de register

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository()
  const registerService = new RegisterService(usersRepository)

  return registerService
}
