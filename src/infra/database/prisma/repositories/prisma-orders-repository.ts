import { OrdersRepository } from '@/domain/shippingCompany/application/repositories/orders-repository'
import { Order } from '@/domain/shippingCompany/enterprise/entities/order'
import { Coordinate } from '@/domain/shippingCompany/enterprise/entities/value-objects/location'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper'
import { PrismaService } from '../prisma.service'
import { Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrdersMapper.toDomain(order)
  }

  async findManyByRecipientId(id: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        id,
      },
    })

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async findManyNearbyDeliveries(
    id: string,
    { latitude, longitude }: Coordinate,
  ) {
    const nearbyRecipients = await this.prisma.$queryRaw<PrismaRecipient[]>`
    SELECT * FROM recipients 
    WHERE (6371 * acos(
      cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
      sin(radians(${latitude})) * sin(radians(latitude))
    )) <= 0.5
  `

    const nearbyOrders = await this.prisma.order.findMany({
      where: {
        id,
        recipientId: {
          in: nearbyRecipients.map((recipient) => recipient.id),
        },
      },
    })

    return nearbyOrders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
