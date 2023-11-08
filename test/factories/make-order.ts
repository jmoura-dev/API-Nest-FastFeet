import { faker } from '@faker-js/faker'
import {
  Order,
  OrderProps,
} from '@/domain/shippingCompany/enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      deliverymanId: new UniqueEntityID(),
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      status: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return order
}
