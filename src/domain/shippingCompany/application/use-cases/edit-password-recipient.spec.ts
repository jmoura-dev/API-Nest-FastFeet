import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { EditPasswordRecipientUseCase } from './edit-password-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditPasswordRecipientUseCase

describe('Edit password recipient', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditPasswordRecipientUseCase(
      inMemoryAdministratorsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to edit the password recipient', async () => {
    const newRecipient = makeRecipient({
      email: 'john@example.com',
      password: '123456',
    })
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)
    inMemoryRecipientsRepository.items.push(newRecipient)

    await sut.execute({
      administratorId: administrator.id.toString(),
      email: 'john@example.com',
      password: '12345678',
    })

    expect(inMemoryRecipientsRepository.items[0].password).toEqual('12345678')
  })

  it('should not be able to edit without a valid administrator', async () => {
    const newRecipient = makeRecipient({
      email: 'john@example.com',
      password: '123456',
    })
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)
    inMemoryRecipientsRepository.items.push(newRecipient)

    const result = await sut.execute({
      administratorId: 'Invalid administratorId',
      email: 'john@example.com',
      password: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to edit with invalid email', async () => {
    const newRecipient = makeRecipient({
      email: 'john@example.com',
      password: '123456',
    })
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)
    inMemoryRecipientsRepository.items.push(newRecipient)

    const result = await sut.execute({
      administratorId: administrator.id.toString(),
      email: 'invalidEmail@example.com',
      password: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
