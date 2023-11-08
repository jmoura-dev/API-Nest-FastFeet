import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/order'
import { InvalidAttachment } from '@/core/errors/errors/invalid-attachment'
import { NotAllowed } from '@/core/errors/errors/not-allowed'

interface MarkOrderAsDeliveredUseCaseRequest {
  deliverymanId: string
  orderId: string
  status: string
  attachment: string
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFound | InvalidAttachment,
  { order: Order }
>

export class MarkOrderAsDeliveredUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    orderId,
    status,
    attachment,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (order.deliverymanId?.toString() !== deliverymanId) {
      return left(new NotAllowed())
    }

    if (attachment === '') {
      return left(new InvalidAttachment())
    }

    order.status = status
    order.attachment = attachment

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
