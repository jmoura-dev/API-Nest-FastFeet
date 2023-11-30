import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import { Coordinate } from '../../enterprise/entities/value-objects/location'

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract findById(id: string): Promise<Order | null>
  abstract findManyByRecipientId(
    params: PaginationParams,
    id: string,
  ): Promise<Order[]>

  abstract findManyByDeliverymanId(
    params: PaginationParams,
    id: string,
  ): Promise<Order[]>

  abstract findManyNearbyDeliveries(
    params: PaginationParams,
    id: string,
    location: Coordinate,
  ): Promise<Order[]>

  abstract save(order: Order): Promise<void>
}
