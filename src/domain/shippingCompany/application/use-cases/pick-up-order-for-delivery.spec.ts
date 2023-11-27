import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { PickUpOrderForDeliveryUseCase } from './pick-up-order-for-delivery'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let sut: PickUpOrderForDeliveryUseCase

describe('Pick up order for delivery', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    sut = new PickUpOrderForDeliveryUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to pick up order for delivery', async () => {
    const order = makeOrder()
    const deliveryman = makeDeliveryman()

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toEqual(
      expect.objectContaining({
        status: 'Pedido saiu para entrega!',
        title: 'Pedido retirado pelo entregador.',
      }),
    )
  })

  it('should not be able to pick up order for delivery without orderId', async () => {
    const order = makeOrder({}, new UniqueEntityID('order-01'))
    const deliveryman = makeDeliveryman()

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      orderId: 'invalid-order',
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to pick up order for delivery without deliverymanId', async () => {
    const order = makeOrder()
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveryman-01'),
    )

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: 'invalid-delivery-man',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
