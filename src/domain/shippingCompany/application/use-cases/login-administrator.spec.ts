import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { LoginAdministratorUseCase } from './login-administrator'
import { makeAdministrator } from 'test/factories/make-administrator'

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

    const { administrator } = await sut.execute({
      cpf: newAdministrator.cpf,
      password: newAdministrator.password,
    })

    expect(administrator.name).toEqual('John Doe')
  })

  it('should not be able to do login on application with invalid data', async () => {
    const newAdministrator = makeAdministrator({
      name: 'John Doe',
    })

    inMemoryAdministratorsRepository.items.push(newAdministrator)

    expect(async () => {
      await sut.execute({
        cpf: 'Invalid cpf',
        password: newAdministrator.password,
      })
    }).rejects.toBeInstanceOf(Error)

    expect(async () => {
      await sut.execute({
        cpf: newAdministrator.cpf,
        password: 'Invalid password',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
