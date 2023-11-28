import { faker } from '@faker-js/faker'
import {
  Order,
  OrderProps,
} from '@/domain/shippingCompany/enterprise/entities/order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaOrdersMapper } from '@/infra/database/prisma/mappers/prisma-orders-mapper'

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

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrdersMapper.toPrisma(order),
    })

    return order
  }
}
