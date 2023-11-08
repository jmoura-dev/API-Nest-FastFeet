import { Order } from '../../enterprise/entities/order'
import { Coordinate } from '../../enterprise/entities/value-objects/location'

export interface OrdersRepository {
  create(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findManyByRecipientId(id: string): Promise<Order[]>
  findManyNearbyDeliveries(id: string, location: Coordinate): Promise<Order[]>
  save(order: Order): Promise<void>
}
