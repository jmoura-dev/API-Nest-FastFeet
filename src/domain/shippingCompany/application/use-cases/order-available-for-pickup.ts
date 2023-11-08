import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { AdministratorsRepository } from '../repositories/administrators-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

interface OrderAvailableForPickupUseCaseRequest {
  orderId: string
  administratorId: string
  status: string
}

type OrderAvailableForPickupUseCaseResponse = Either<
  ResourceNotFound,
  { order: Order }
>

export class OrderAvailableForPickupUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private administratorsRepository: AdministratorsRepository,
  ) {}

  async execute({
    administratorId,
    orderId,
    status,
  }: OrderAvailableForPickupUseCaseRequest): Promise<OrderAvailableForPickupUseCaseResponse> {
    const administrator =
      await this.administratorsRepository.findById(administratorId)

    if (!administrator) {
      return left(new ResourceNotFound())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    order.status = status

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
