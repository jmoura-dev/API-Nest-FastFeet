import { Either, left, right } from '@/core/either'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'

interface ListNearbyDeliveriesUseCaseRequest {
  deliverymanId: string
  latitude: number
  longitude: number
}

type ListNearbyDeliveriesUseCaseResponse = Either<
  ResourceNotFound,
  {
    orders: Order[]
  }
>

@Injectable()
export class ListNearbyDeliveriesUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    deliverymanId,
    latitude,
    longitude,
  }: ListNearbyDeliveriesUseCaseRequest): Promise<ListNearbyDeliveriesUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    const orders = await this.ordersRepository.findManyNearbyDeliveries(
      deliverymanId,
      { latitude, longitude },
    )

    return right({
      orders,
    })
  }
}
