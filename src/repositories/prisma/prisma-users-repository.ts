import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../../generated/prisma/browser'
import type { UsersRepository } from './users-repository'
import type { User } from '../../../generated/prisma/client'

export class PrismaUsersRepository implements UsersRepository {
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
}
