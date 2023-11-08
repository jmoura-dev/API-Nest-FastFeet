import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { LoginDeliverymanUseCase } from './login-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { CredentialsDoNotMatch } from '@/core/errors/errors/credentials-do-not-match'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: LoginDeliverymanUseCase

describe('Login Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new LoginDeliverymanUseCase(inMemoryDeliverymansRepository)
  })

  it('should be able to do login on application', async () => {
    const newDeliveryman = makeDeliveryman({
      name: 'John Doe',
    })

    inMemoryDeliverymansRepository.items.push(newDeliveryman)

    const result = await sut.execute({
      cpf: newDeliveryman.cpf,
      password: newDeliveryman.password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      deliveryman: { name: 'John Doe', cpf: newDeliveryman.cpf },
    })
  })

  it('should not be able to do login on application with invalid cpf', async () => {
    const newDeliveryman = makeDeliveryman({
      name: 'John Doe',
    })

    inMemoryDeliverymansRepository.items.push(newDeliveryman)

    const result = await sut.execute({
      cpf: 'Invalid cpf',
      password: newDeliveryman.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsDoNotMatch)
  })

  it('should not be able to do login on application with invalid password', async () => {
    const newDeliveryman = makeDeliveryman({
      name: 'John Doe',
      password: '123456',
    })

    inMemoryDeliverymansRepository.items.push(newDeliveryman)

    const result = await sut.execute({
      cpf: newDeliveryman.cpf,
      password: 'Invalid password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CredentialsDoNotMatch)
  })
})
