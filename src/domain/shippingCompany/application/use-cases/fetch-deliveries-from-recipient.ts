import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'

interface FetchDeliveriesFromRecipientRequest {
  recipientId: string
}

type FetchDeliveriesFromRecipientResponse = Either<
  ResourceNotFound,
  {
    orders: Order[]
  }
>

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
      return left(new ResourceNotFound())
    }

    const orders =
      await this.ordersRepository.findManyByRecipientId(recipientId)

    return right({
      orders,
    })
  }
}
