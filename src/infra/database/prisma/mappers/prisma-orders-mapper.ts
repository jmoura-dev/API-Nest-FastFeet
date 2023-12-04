import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/shippingCompany/enterprise/entities/Order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        deliverymanId: raw.userId ? new UniqueEntityID(raw.userId) : null,
        title: raw.title,
        status: raw.status,
        attachment: raw.attachmentId ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      userId: order.deliverymanId ? order.deliverymanId.toString() : null,
      title: order.title,
      status: order.status,
      attachmentId: order.attachment,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
