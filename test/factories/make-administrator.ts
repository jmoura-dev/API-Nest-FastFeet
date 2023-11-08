import { faker } from '@faker-js/faker'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/shippingCompany/enterprise/entities/administrator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: faker.lorem.word(),
      cpf: faker.string.numeric(13),
      password: faker.internet.password(),
      isAdmin: true,
      ...override,
    },
    id,
  )

  return administrator
}
