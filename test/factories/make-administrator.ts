import { faker } from '@faker-js/faker'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/shippingCompany/enterprise/entities/administrator'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaUsersMapper } from '@/infra/database/prisma/mappers/prisma-users-mapper'

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: faker.lorem.word(),
      cpf: faker.string.numeric(13),
      password: faker.internet.password(),
      role: 'ADMIN',
      ...override,
    },
    id,
  )

  return administrator
}

@Injectable()
export class AdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdministrator(
    data: Partial<AdministratorProps> = {},
  ): Promise<Administrator> {
    const administrator = makeAdministrator(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(administrator),
    })

    return administrator
  }
}
