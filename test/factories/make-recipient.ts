import { faker } from '@faker-js/faker'
import {
  Recipient,
  RecipientProps,
} from '@/domain/shippingCompany/enterprise/entities/recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaRecipientsMapper } from '@/infra/database/prisma/mappers/prisma-recipients-mapper'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.lorem.word(),
      city: faker.location.city(),
      email: faker.internet.email(),
      houseNumber: faker.number.int({ min: 1, max: 4 }),
      neighborhood: faker.location.street(),
      password: faker.internet.password(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientsMapper.toPrisma(recipient),
    })

    return recipient
  }
}
