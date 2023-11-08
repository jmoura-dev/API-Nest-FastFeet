import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Order } from '../../enterprise/entities/order'

interface CreateOrderUseCaseRequest {
  recipientId: string
  title: string
  status: string
}

interface CreateOrderUseCaseResponse {
  orderCreated: void
}

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
      throw new Error('Recipient not found')
    }

    const order = Order.create({
      recipientId: recipient.id,
      title,
      status,
    })

    const orderCreated = await this.ordersRepository.create(order)

    return {
      orderCreated,
    }
  }
}
