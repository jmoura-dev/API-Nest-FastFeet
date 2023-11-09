import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Administrator } from '@/domain/shippingCompany/enterprise/entities/administrator'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): Administrator {
    return Administrator.create(
      {
        cpf: raw.cpf,
        password: raw.password,
        name: raw.name,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    administrator: Administrator,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: administrator.id.toString(),
      cpf: administrator.cpf,
      password: administrator.password,
      name: administrator.name,
    }
  }
}
