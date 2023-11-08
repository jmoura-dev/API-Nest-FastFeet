import { faker } from '@faker-js/faker'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shippingCompany/enterprise/entities/deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

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
