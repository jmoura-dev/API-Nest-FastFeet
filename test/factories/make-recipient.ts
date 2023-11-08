import { faker } from '@faker-js/faker'
import {
  Recipient,
  RecipientProps,
} from '@/domain/shippingCompany/enterprise/entities/recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.lorem.word(),
      city: faker.location.city(),
      email: faker.internet.email(),
      houseNumber: faker.number.int(),
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
