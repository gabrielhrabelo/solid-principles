import type { UsersRepository } from "@/repositories/prisma/users-repository"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"
import { compare } from "bcryptjs"
import type { User } from "../../generated/prisma/client"

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ email, password }: AuthenticateServiceRequest): Promise <AuthenticateServiceResponse> {
    // auth
    // search for the user in the database
    // verify if password matches

    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }
    return { user }
  }
}