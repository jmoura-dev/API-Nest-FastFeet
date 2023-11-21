import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { CreateAccountUseCase } from './create-account'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher
let sut: CreateAccountUseCase

describe('Create Administrator Use Case', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAccountUseCase(inMemoryAdministratorsRepository, fakeHasher)
  })

  it('should be able to create a new administrator', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123412312-12',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdministratorsRepository.items[0].name).toEqual('John Doe')
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123412312-12',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdministratorsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
