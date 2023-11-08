import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { ListNearbyDeliveriesUseCase } from './list-nearby-deliveries'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

let inMemoryRecipientRepository: InMemoryRecipientsRepository

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: ListNearbyDeliveriesUseCase

describe('Fetch nearby deliveries list', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientsRepository()

    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new ListNearbyDeliveriesUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able list only nearby deliveries within 300 meters', async () => {
    const deliveryman = makeDeliveryman()

    const recipient1 = makeRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })
    const recipient2 = makeRecipient({
      latitude: -9.603076,
      longitude: -35.759209,
    })

    inMemoryDeliverymansRepository.items.push(deliveryman)
    inMemoryRecipientRepository.items.push(recipient1)
    inMemoryRecipientRepository.items.push(recipient2)

    const order1 = makeOrder({
      deliverymanId: deliveryman.id,
      title: 'pedido-01',
      recipientId: recipient1.id,
    })
    const order2 = makeOrder({
      deliverymanId: deliveryman.id,
      title: 'pedido-02',
      recipientId: recipient2.id,
    })
    const order3 = makeOrder({
      deliverymanId: deliveryman.id,
      title: 'pedido-03',
      recipientId: recipient1.id,
    })

    inMemoryOrdersRepository.items.push(order1)
    inMemoryOrdersRepository.items.push(order2)
    inMemoryOrdersRepository.items.push(order3)

    const deliverymanId = deliveryman.id.toString()

    const result = await sut.execute({
      deliverymanId,
      latitude: -9.600538,
      longitude: -35.7608173,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({ title: 'pedido-01' }),
        expect.objectContaining({ title: 'pedido-03' }),
      ],
    })
  })

  it('should not be able list nearby deliveries with invalid deliverymanId', async () => {
    const deliveryman = makeDeliveryman()

    const recipient = makeRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })

    inMemoryDeliverymansRepository.items.push(deliveryman)
    inMemoryRecipientRepository.items.push(recipient)

    const order = makeOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: 'invalid-deliveryman-id',
      latitude: -9.600538,
      longitude: -35.7608173,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
