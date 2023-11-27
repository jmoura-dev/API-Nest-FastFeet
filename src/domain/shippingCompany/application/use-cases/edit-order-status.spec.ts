import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { EditOrderStatusUseCase } from './edit-order-status'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: EditOrderStatusUseCase

describe('Update status', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new EditOrderStatusUseCase(
      inMemoryOrdersRepository,
      inMemoryAdministratorsRepository,
    )
  })

  it('should be able to update status', async () => {
    const administrator = makeAdministrator()
    const order = makeOrder({
      status: 'pedido feito',
    })

    inMemoryOrdersRepository.items.push(order)
    inMemoryAdministratorsRepository.items.push(administrator)

    const orderId = order.id.toString()
    const administratorId = administrator.id.toString()

    const result = await sut.execute({
      administratorId,
      orderId,
      status: 'Pedido aguardando a empresa realizar coleta',
      title: 'Aguardando retirada',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      status: 'Pedido aguardando a empresa realizar coleta',
      title: 'Aguardando retirada',
    })
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
      status: 'Pedido aguardando a empresa realizar coleta',
      title: 'Aguardando retirada',
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
      status: 'Pedido entregue com sucesso!',
      title: 'Entregue',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
