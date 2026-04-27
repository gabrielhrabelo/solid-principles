import { randomUUID } from "node:crypto"
import type { User } from "../../../generated/prisma/client"
import type { UserCreateInput } from "../../../generated/prisma/models"
import type { UsersRepository } from "../prisma/users-repository"

export class InMemoryUsersRepository implements UsersRepository {

  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(item => item.id === id)

    if(!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }
    return user
  }
  async create(data: UserCreateInput) {
    const user =  {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    }

    this.items.push(user)

    return user

  }

}