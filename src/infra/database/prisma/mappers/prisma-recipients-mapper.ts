import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/shippingCompany/enterprise/entities/recipient'
import { Slug } from '@/domain/shippingCompany/enterprise/entities/value-objects/slug'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientsMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        city: raw.city,
        neighborhood: raw.neighborhood,
        houseNumber: raw.houseNumber,
        slug: Slug.create(raw.slug),
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      password: recipient.password,
      city: recipient.city,
      neighborhood: recipient.neighborhood,
      houseNumber: recipient.houseNumber,
      slug: recipient.slug.value,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
