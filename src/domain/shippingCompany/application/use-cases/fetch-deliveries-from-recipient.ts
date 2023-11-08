import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface FetchDeliveriesFromRecipientRequest {
  recipientId: string
}

interface FetchDeliveriesFromRecipientResponse {
  orders: Order[]
}

export class FetchDeliveriesFromRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    recipientId,
  }: FetchDeliveriesFromRecipientRequest): Promise<FetchDeliveriesFromRecipientResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      throw new Error('Recipient not found.')
    }

    const orders =
      await this.ordersRepository.findManyByRecipientId(recipientId)

    return {
      orders,
    }
  }
}
