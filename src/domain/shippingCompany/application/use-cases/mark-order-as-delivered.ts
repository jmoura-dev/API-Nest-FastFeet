import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/order'
import { InvalidAttachment } from '@/core/errors/errors/invalid-attachment'
import { NotAllowed } from '@/core/errors/errors/not-allowed'
import { Injectable } from '@nestjs/common'

interface MarkOrderAsDeliveredUseCaseRequest {
  deliverymanId: string
  orderId: string
  attachment: string
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFound | InvalidAttachment,
  { order: Order }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    orderId,
    attachment,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (order.deliverymanId?.toString() !== deliverymanId) {
      return left(new NotAllowed())
    }

    if (attachment === '' || attachment === null) {
      return left(new InvalidAttachment())
    }

    order.title = 'Pedido entregue.'
    order.status = 'Pedido entregue com sucesso!'
    order.attachment = attachment

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
