import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateOrderUseCase } from './create-order'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateOrderUseCase

describe('Create a new order', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to create a new order', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    await sut.execute({
      recipientId: recipient.id.toString(),
      title: 'New order 01',
      status: 'Aguardando',
    })

    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items[0].title).toEqual('New order 01')
  })
})
