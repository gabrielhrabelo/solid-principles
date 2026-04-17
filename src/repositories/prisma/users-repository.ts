import type { Prisma } from "@/../generated/prisma/browser"
import type { User } from "../../../generated/prisma/client"


export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}