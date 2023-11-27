import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { OrdersRepository } from '../repositories/orders-repository'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { Order } from '../../enterprise/entities/order'

interface EditOrderStatusUseCaseRequest {
  administratorId: string
  orderId: string
  status: string
  title: string
}

type EditOrderStatusUseCaseResponse = Either<ResourceNotFound, { order: Order }>

export class EditOrderStatusUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private administratorsRepository: AdministratorsRepository,
  ) {}

  async execute({
    administratorId,
    orderId,
    status,
    title,
  }: EditOrderStatusUseCaseRequest): Promise<EditOrderStatusUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    const administrator =
      await this.administratorsRepository.findById(administratorId)

    if (!administrator) {
      return left(new ResourceNotFound())
    }

    order.title = title
    order.status = status

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
