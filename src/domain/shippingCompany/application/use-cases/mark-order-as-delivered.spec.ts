import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered'
import { InvalidAttachment } from '@/core/errors/errors/invalid-attachment'
import { NotAllowed } from '@/core/errors/errors/not-allowed'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsDeliveredUseCase

describe('Update status to delivered', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderAsDeliveredUseCase(inMemoryOrdersRepository)
  })

  it('should be able to update status to delivered', async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      status: 'pedido feito',
      deliverymanId: deliveryman.id,
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const orderId = order.id.toString()
    const deliverymanId = deliveryman.id.toString()

    const result = await sut.execute({
      deliverymanId,
      orderId,
      status: 'Entregue',
      attachment: 'image.png',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'Entregue',
      attachment: 'image.png',
    })
  })

  it('should not be able to update with invalid order ID', async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder(
      {
        status: 'pedido feito',
        deliverymanId: deliveryman.id,
      },
      new UniqueEntityID('order-01'),
    )

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const deliverymanId = deliveryman.id.toString()

    const result = await sut.execute({
      deliverymanId,
      orderId: 'invalid order ID',
      status: 'Aguardando retirada',
      attachment: 'image.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update with invalid deliveryman', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('admin-01'))
    const order = makeOrder({
      status: 'pedido feito',
      deliverymanId: deliveryman.id,
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const orderId = order.id.toString()

    const result = await sut.execute({
      deliverymanId: 'invalid deliveryman ID',
      orderId,
      status: 'Entregue',
      attachment: 'image.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowed)
  })

  it('should not be able to update for delivery with an invalid attachment', async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      status: 'pedido feito',
      deliverymanId: deliveryman.id,
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const orderId = order.id.toString()
    const deliverymanId = deliveryman.id.toString()

    const result = await sut.execute({
      deliverymanId,
      orderId,
      status: 'Entregue',
      attachment: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachment)
  })
})
