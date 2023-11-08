import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { LoginAdministratorUseCase } from './login-administrator'
import { makeAdministrator } from 'test/factories/make-administrator'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: LoginAdministratorUseCase

describe('Login Administrator', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new LoginAdministratorUseCase(inMemoryAdministratorsRepository)
  })

  it('should be able to do login on application', async () => {
    const newAdministrator = makeAdministrator({
      name: 'John Doe',
    })

    inMemoryAdministratorsRepository.items.push(newAdministrator)

    const result = await sut.execute({
      cpf: newAdministrator.cpf,
      password: newAdministrator.password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      administrator: { name: 'John Doe', cpf: newAdministrator.cpf },
    })
  })

  it('should not be able to do login on application with invalid cpf', async () => {
    const newAdministrator = makeAdministrator({
      name: 'John Doe',
    })

    inMemoryAdministratorsRepository.items.push(newAdministrator)

    const result = await sut.execute({
      cpf: 'Invalid cpf',
      password: newAdministrator.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsDoNotMatch)
  })

  it('should not be able to do login on application with invalid password', async () => {
    const newAdministrator = makeAdministrator({
      name: 'John Doe',
      password: '123456',
    })

    inMemoryAdministratorsRepository.items.push(newAdministrator)

    const result = await sut.execute({
      cpf: newAdministrator.cpf,
      password: 'Invalid password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsDoNotMatch)
  })
})
