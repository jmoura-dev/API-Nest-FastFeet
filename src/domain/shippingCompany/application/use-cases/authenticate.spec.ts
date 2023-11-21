import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUseCase } from './authenticate'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate Administrator', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryAdministratorsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a administrator', async () => {
    const administrator = makeAdministrator({
      cpf: '123456789-12',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      cpf: '123456789-12',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
