import { faker } from '@faker-js/faker'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shippingCompany/enterprise/entities/deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaDeliverymansMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      name: faker.lorem.word(),
      cpf: faker.string.numeric(13),
      password: faker.internet.password(),
      orders: [],
      ...override,
    },
    id,
  )

  return deliveryman
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymansMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
