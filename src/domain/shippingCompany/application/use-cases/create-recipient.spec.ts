import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateRecipientUseCase } from './create-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('Create Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a new recipient', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      city: 'San Francisco',
      houseNumber: 35,
      neighborhood: 'Tabuleiro',
      latitude: -9.6678173,
      longitude: -35.7516062,
    })

    expect(inMemoryRecipientsRepository.items).toHaveLength(1)
    expect(inMemoryRecipientsRepository.items[0].name).toEqual('John Doe')
  })
})
