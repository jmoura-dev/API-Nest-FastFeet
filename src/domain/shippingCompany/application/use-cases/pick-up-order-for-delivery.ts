import { Either, left, right } from '@/core/either'
import { DeliverymansRepository } from '../repositories/deliverymans-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFound } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface PickUpOrderForDeliveryUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type PickUpOrderForDeliveryUseCaseResponse = Either<
  ResourceNotFound,
  {
    order: Order
  }
>

@Injectable()
export class PickUpOrderForDeliveryUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
  }: PickUpOrderForDeliveryUseCaseRequest): Promise<PickUpOrderForDeliveryUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFound())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFound())
    }

    order.deliverymanId = new UniqueEntityID(deliverymanId)
    order.status = 'Pedido saiu para entrega!'
    order.title = 'Pedido retirado pelo entregador.'

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}
