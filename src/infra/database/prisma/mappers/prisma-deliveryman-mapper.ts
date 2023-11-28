import { Deliveryman } from '@/domain/shippingCompany/enterprise/entities/deliveryman'
import { Prisma } from '@prisma/client'

export class PrismaDeliverymansMapper {
  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf,
      password: deliveryman.password,
      name: deliveryman.name,
    }
  }
}
