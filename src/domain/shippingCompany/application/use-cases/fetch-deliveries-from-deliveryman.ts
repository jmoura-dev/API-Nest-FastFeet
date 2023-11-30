import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'

interface FetchDeliveriesFromDeliverymanRequest {
  page: number
  deliverymanId: string
}

type FetchDeliveriesFromDeliverymanResponse = Either<
  ResourceNotFound,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchDeliveriesFromDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    page,
    deliverymanId,
  }: FetchDeliveriesFromDeliverymanRequest): Promise<FetchDeliveriesFromDeliverymanResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    const orders = await this.ordersRepository.findManyByDeliverymanId(
      { page },
      deliverymanId,
    )

    return right({
      orders,
    })
  }
}
