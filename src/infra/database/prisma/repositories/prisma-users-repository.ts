import { AdministratorsRepository } from '@/domain/shippingCompany/application/repositories/administrators-repository'
import { Administrator } from '@/domain/shippingCompany/enterprise/entities/administrator'
import { PrismaService } from '../prisma.service'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper'

export class PrismaUsersRepository implements AdministratorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(administrator: Administrator): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(administrator)

    await this.prisma.user.create({
      data,
    })
  }

  async findById(id: string): Promise<Administrator | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async findByCpf(cpf: string): Promise<Administrator | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async save(administrator: Administrator): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(administrator)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
