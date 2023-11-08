import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Order } from '../../enterprise/entities/order'
import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

interface CreateOrderUseCaseRequest {
  recipientId: string
  title: string
  status: string
}

type CreateOrderUseCaseResponse = Either<ResourceNotFound, null>

export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    status,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    const order = Order.create({
      recipientId: recipient.id,
      title,
      status,
    })

    await this.ordersRepository.create(order)

    return right(null)
  }
}
