import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { FetchDeliveriesFromDeliverymanUseCase } from './fetch-deliveries-from-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchDeliveriesFromDeliverymanUseCase

describe('Fetch deliveries from deliveryman', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchDeliveriesFromDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to list all orders from deliveryman', async () => {
    const recipient = makeRecipient()

    const deliveryman1 = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-1'),
    )
    const deliveryman2 = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-2'),
    )

    inMemoryDeliverymansRepository.items.push(deliveryman1)
    inMemoryDeliverymansRepository.items.push(deliveryman2)

    const order1 = makeOrder({
      recipientId: recipient.id,
      title: 'order-01',
      deliverymanId: deliveryman1.id,
    })

    const order2 = makeOrder({
      recipientId: recipient.id,
      title: 'order-02',
      deliverymanId: deliveryman1.id,
    })

    const order3 = makeOrder({
      recipientId: recipient.id,
      title: 'order-03',
      deliverymanId: deliveryman2.id,
    })

    inMemoryOrdersRepository.items.push(order1)
    inMemoryOrdersRepository.items.push(order2)
    inMemoryOrdersRepository.items.push(order3)

    const result = await sut.execute({
      page: 1,
      deliverymanId: deliveryman1.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      orders: expect.arrayContaining([order1, order2]),
    })
  })

  it('should not be able to list orders with invalid DeliverymanId', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const order1 = makeOrder({
      recipientId: recipient.id,
      title: 'order-01',
      deliverymanId: new UniqueEntityID('deliveryman-01'),
    })

    inMemoryOrdersRepository.items.push(order1)

    expect(inMemoryOrdersRepository.items).toHaveLength(1)

    const result = await sut.execute({
      page: 1,
      deliverymanId: 'Invalid deliverymanId',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
