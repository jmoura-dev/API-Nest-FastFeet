import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchDeliveriesFromRecipientUseCase } from './fetch-deliveries-from-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchDeliveriesFromRecipientUseCase

describe('Fetch deliveries from recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchDeliveriesFromRecipientUseCase(
      inMemoryRecipientsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to list all orders from recipient', async () => {
    const recipient1 = makeRecipient({}, new UniqueEntityID('recipient-1'))
    const recipient2 = makeRecipient({}, new UniqueEntityID('recipient-2'))

    inMemoryRecipientsRepository.items.push(recipient1)
    inMemoryRecipientsRepository.items.push(recipient2)

    const order1 = makeOrder({
      recipientId: recipient1.id,
      title: 'order-01',
    })

    const order2 = makeOrder({
      recipientId: recipient1.id,
      title: 'order-02',
    })

    const order3 = makeOrder({
      recipientId: recipient2.id,
      title: 'order-03',
    })

    inMemoryOrdersRepository.items.push(order1)
    inMemoryOrdersRepository.items.push(order2)
    inMemoryOrdersRepository.items.push(order3)

    const { orders } = await sut.execute({
      recipientId: recipient1.id.toString(),
    })

    expect(orders).toHaveLength(2)
    expect(orders).toEqual([
      expect.objectContaining({
        title: 'order-01',
      }),
      expect.objectContaining({
        title: 'order-02',
      }),
    ])
  })

  it('should not be able to list orders with invalid recipientId', async () => {
    const recipient1 = makeRecipient({}, new UniqueEntityID('recipient-1'))

    inMemoryRecipientsRepository.items.push(recipient1)

    const order1 = makeOrder({
      recipientId: recipient1.id,
      title: 'order-01',
    })

    inMemoryOrdersRepository.items.push(order1)

    expect(inMemoryOrdersRepository.items).toHaveLength(1)

    expect(async () => {
      await sut.execute({
        recipientId: 'Invalid recipientId',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
