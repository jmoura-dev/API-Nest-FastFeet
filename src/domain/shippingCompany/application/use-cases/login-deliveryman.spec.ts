import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { LoginDeliverymanUseCase } from './login-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

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

    const { deliveryman } = await sut.execute({
      cpf: newDeliveryman.cpf,
      password: newDeliveryman.password,
    })

    expect(deliveryman.name).toEqual('John Doe')
  })

  it('should not be able to do login on application with invalid data', async () => {
    const newDeliveryman = makeDeliveryman({
      name: 'John Doe',
    })

    inMemoryDeliverymansRepository.items.push(newDeliveryman)

    expect(async () => {
      await sut.execute({
        cpf: 'Invalid cpf',
        password: newDeliveryman.password,
      })
    }).rejects.toBeInstanceOf(Error)

    expect(async () => {
      await sut.execute({
        cpf: newDeliveryman.cpf,
        password: 'Invalid password',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
