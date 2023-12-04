import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/order'
import { InvalidAttachment } from '@/core/errors/errors/invalid-attachment'
import { NotAllowed } from '@/core/errors/errors/not-allowed'
import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from '../repositories/attachments-repository'

interface MarkOrderAsDeliveredUseCaseRequest {
  deliverymanId: string
  orderId: string
  attachmentId: string
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFound | InvalidAttachment,
  { order: Order }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
    attachmentId,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    if (order.deliverymanId?.toString() !== deliverymanId) {
      return left(new NotAllowed())
    }

    if (attachmentId === '' || attachmentId === null) {
      return left(new InvalidAttachment())
    }

    const attachment = await this.attachmentsRepository.findById(attachmentId)

    if (!attachment) {
      return left(new InvalidAttachment())
    }

    order.title = 'Pedido entregue.'
    order.status = 'Pedido entregue com sucesso!'
    order.attachment = attachment.id.toString()

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
