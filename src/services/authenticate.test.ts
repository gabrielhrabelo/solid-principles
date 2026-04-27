import { expect, describe, it } from "vitest"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { AuthenticateService } from "./authenticate"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"
import { beforeEach } from "vitest"

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('it should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } =  await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('it should not be able to authenticate with wrong email', async () => {
    expect(() => sut.execute({
      email: 'johndoe@email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('it should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })
 
    expect(() => sut.execute({
      email: 'johndoe@email.com',
      password: '123123'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  
})