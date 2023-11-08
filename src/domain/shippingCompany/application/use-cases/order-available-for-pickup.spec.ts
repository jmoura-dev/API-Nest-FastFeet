import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderAvailableForPickupUseCase } from './order-available-for-pickup'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: OrderAvailableForPickupUseCase

describe('Update status to pickup', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new OrderAvailableForPickupUseCase(
      inMemoryOrdersRepository,
      inMemoryAdministratorsRepository,
    )
  })

  it('should be able to update status to pickup', async () => {
    const administrator = makeAdministrator()
    const order = makeOrder({
      status: 'pedido feito',
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryAdministratorsRepository.items.push(administrator)

    const administratorId = administrator.id.toString()
    const orderId = order.id.toString()

    const result = await sut.execute({
      administratorId,
      orderId,
      status: 'Aguardando retirada',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].status).toEqual(
      'Aguardando retirada',
    )
  })

  it('should not be able to update with invalid order ID', async () => {
    const administrator = makeAdministrator()
    const order = makeOrder(
      {
        status: 'pedido feito',
      },
      new UniqueEntityID('order-01'),
    )

    inMemoryOrdersRepository.items.push(order)
    inMemoryAdministratorsRepository.items.push(administrator)

    const administratorId = administrator.id.toString()

    const result = await sut.execute({
      administratorId,
      orderId: 'invalid order ID',
      status: 'Aguardando retirada',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update with invalid administrator', async () => {
    const administrator = makeAdministrator({}, new UniqueEntityID('admin-01'))
    const order = makeOrder({
      status: 'pedido feito',
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryAdministratorsRepository.items.push(administrator)

    const orderId = order.id.toString()

    const result = await sut.execute({
      administratorId: 'invalid administrator ID',
      orderId,
      status: 'Aguardando retirada',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
