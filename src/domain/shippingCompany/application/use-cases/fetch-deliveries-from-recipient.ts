import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'

interface FetchDeliveriesFromRecipientRequest {
  page: number
  recipientId: string
}

type FetchDeliveriesFromRecipientResponse = Either<
  ResourceNotFound,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchDeliveriesFromRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    page,
    recipientId,
  }: FetchDeliveriesFromRecipientRequest): Promise<FetchDeliveriesFromRecipientResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    const orders = await this.ordersRepository.findManyByRecipientId(
      { page },
      recipientId,
    )

    return right({
      orders,
    })
  }
}
