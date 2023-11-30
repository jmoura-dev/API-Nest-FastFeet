import { OrdersRepository } from '@/domain/shippingCompany/application/repositories/orders-repository'
import { Order } from '@/domain/shippingCompany/enterprise/entities/order'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from '@/domain/shippingCompany/enterprise/entities/value-objects/location'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryOrdersRepository implements OrdersRepository {
  constructor(private recipientsRepository: InMemoryRecipientsRepository) {}

  public items: Order[] = []

  async create(order: Order) {
    this.items.push(order)
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByRecipientId({ page }: PaginationParams, id: string) {
    const orders = this.items
      .filter((order) => order.recipientId.toString() === id)
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyNearbyDeliveries(
    _,
    deliverymanId: string,
    location: Coordinate,
  ) {
    const orders = this.items.filter(
      (order) => order.deliverymanId?.toString() === deliverymanId,
    )

    const nearbyOrders = Promise.all(
      orders.filter((order) => {
        const recipient = this.recipientsRepository.items.find(
          (recipient) =>
            recipient.id.toString() === order.recipientId.toString(),
        )

        if (recipient) {
          const distance = getDistanceBetweenCoordinates(
            { latitude: recipient.latitude, longitude: recipient.longitude },
            { latitude: location.latitude, longitude: location.longitude },
          )

          if (distance <= 300) {
            return true
          } else {
            return false
          }
        }

        return false
      }),
    )

    return nearbyOrders
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}
